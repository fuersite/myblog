---
title: node-高并发处理
date: 2019-09-04 15:21:04
categories: javascript
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
tags:
  - node.js
  - javascript
---

Node.js 是单进程单线程应用程序，但是因为 V8 引擎提供的异步执行回调接口，通过这些接口可以处理大量的并发，所以性能非常高。
Node.js 几乎每一个 API 都是支持回调函数的。
<!-- more -->

------

## 事件驱动程序

Node.js 使用事件驱动模型，当web server接收到请求，就把它关闭然后进行处理，然后去服务下一个web请求。
当这个请求完成，它被放回处理队列，当到达队列开头，这个结果被返回给用户。
这个模型非常高效可扩展性非常强，因为webserver一直接受请求而不等待任何读写操作。（这也被称之为非阻塞式IO或者事件驱动IO）
在事件驱动模型中，会生成一个主循环来监听事件，当检测到事件时触发回调函数

![event_loop](/images/event_loop.jpg)


## node 单线程理解

> 简单单线程例子

```javascript
var http = require('http');

http.createServer(function(req, res) {
    res.end(`你好世界`);
}).listen(3000, ()=> {
    console.log('listening 3000')
});
```
node 本身就是单线程应用程序，只有一个主线程，当一个请求进来，需要处理完才会处理下一个请求，但是如果上一个请求很耗时，后面的请求都会被阻塞。严重的如果出现错误未捕获，都会导致整个服务程序退出。

> 下面我们演示一个耗时例子

```javascript
var http = require('http');
function sleep (time) {
    let end_time = Date.now() + time * 1000
    while (Date.now() < end_time) {

    }
    return 
}
http.createServer(function(req, res) {
    sleep(10)
    res.end(`你好世界`);
}).listen(3000, ()=> {
    console.log('listening 3000')
});
```
添加了一个延时操作10s,连续发送两个请求http://localhost:3000,一个耗时10s左右，一个耗时20s左右，说明第二个请求被阻塞了，以此类推。可以想象单线程的恐怖了吧哈哈。

## node异步

I/O异步

- 文件操作I/O
- ajax请求

非I/O异步
- setTimeout/setInteval ...

无论是I/O异步还是非I/O异步都是通过事件回调完成操作并通知事件对象。


## 高并发解决方案

##### 1. 多进程控制： node是单线程的应用，也就是一个进程只能有一个线程。那么我们开启多个node进程不就有多个线程了吗。

> * Node 提供了 child_process 模块来创建子进程，方法有：
> * exec - child_process.exec 使用子进程执行命令，缓存子进程的输出，并将子进程的输出以回调函数参数的形式返回。
> * spawn - child_process.spawn 使用指定的命令行参数创建新进程。
> * fork - child_process.fork 是 spawn()的特殊形式，用于在子进程中运行的模块，如 fork('./son.js') 相当于 spawn('node', ['./son.js']) 。与spawn方法不同的是，fork会在父进程与子进程之间，建立一个通信管道，用于进程之间的通信。

```javascript
const numCPUs = require('os').cpus().length; // 根据系统内核多少fork多少
const cluster = require('cluster');
var http = require('http');
function sleep (time) {
    let end_time = Date.now() + time * 1000
    while (Date.now() < end_time) {

    }
    return 
}
if (cluster.isMaster) {
  // fork子进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });

} else {
    http.createServer(function(req, res) {
        sleep(10)
        res.end(`你好世界`);
    }).listen(3000, ()=> {
        console.log('listening 3000')
    });
   console.log(`工作进程 ${process.pid} 已启动`);
}
```

启动服务后，连续访问localhost:3000，这时候第一个请求10s左右，第二个请求可能10s左右，也可能20s左右，Why? 
—— 因为我们虽然多个fork子进程同时监听3000端口，但是请求进来后，是被随机分配给子进程的，如果两次分配到同一个子进程，那就呵呵。。。。。。

##### 1. 事件监听回调：使用eventproxy控制事件订阅发布。

```javascript
var EventProxy = require('eventproxy')
var ep = new EventProxy();
const numCPUs = require('os').cpus().length; // 根据系统内核多少fork多少
const cluster = require('cluster');
var http = require('http');
function sleep (time) {
    let end_time = Date.now() + time * 1000
    while (Date.now() < end_time) {

    }
    return 
}
if (cluster.isMaster) {
  // fork子进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });

} else {
    let status = 1, index=0
    http.createServer(function(req, res) {
        index++
        // 测试一：
        // (function(index){
        //     setTimeout(()=>{
        //         res.end(`你好世界:${index}`);
        //     },100)
        // })(index)
        // return

        // 测试二：
        (function(index){
            // 同意返回结果
            ep.once("finished", (result)=> {
                res.end(`你好世界:${index}`);
            });
        })(index)
        
        // 标志状态 控制是否执行耗时操作，100ms里面无论进来多少请求，只做一次异步耗时操作（setTimeout 相当于sql查询语句）
        console.log(`工作进程 ${process.pid} 正在运行${status}`);
        if (status) {
            status = 0
            setTimeout(()=>{
                ep.emit("finished", 'result');
                status = 1
            },100)
        }
    }).listen(3000, ()=> {
        console.log('listening 3000')
    });
}
```
ep.once() 表示只执行一次，这种方式可以减少查询数据库等操作，如果当前100ms内容来了100请求，那么会把结果一次返回。

提供一个压测脚本: test.js

```javascript 
var request = require('request');
for (let i = 1; i<= 1000; i++) {
    let now =  Date.now().valueOf()
    request('http://localhost:3000', function (error, response,body) {
        console.log(`${i}----star: ${now} ==========:`, Date.now().valueOf() - now, body)
    })
}

运行：node  test.js
```