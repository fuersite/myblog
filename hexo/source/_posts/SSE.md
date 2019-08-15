---
title: SSE - 服务端推送
date: 2018-12-01 08:53:18
categories: javascript
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
tags:
  - SSE
---

Using server-sent events

<!-- more -->

## SSE- 单向消息传递
Server-Sent 事件指的是网页自动获取来自服务器的更新。所有主流浏览器均支持服务器发送事件，除了 Internet Explorer。

## 检测 Server-Sent 事件支持

        if(typeof(EventSource)!=="undefined")
        {
            // 浏览器支持 Server-Sent
            // 一些代码.....
        }
        else
        {
            // 浏览器不支持 Server-Sent..
        }

## 客户端接收消息
        var source=new EventSource("http://127.0.0.1/sse");
        source.onmessage=function(event)
        {
            console.log('event.data========  ',event.data)
        }

## 服务端推送消息 - Node版
        var http = require("http");
        var fs = require('fs')
        http.createServer(function (req, res) {

            var fileName = "." + req.url;
            if (fileName === "./sse") {
                res.writeHead(200, {"Content-Type":"text/event-stream", 
                                    "Cache-Control":"no-cache", 
                                    "Connection":"keep-alive"});
                res.write("retry: 6000\n");
                res.write("data: " + (new Date()) + "\n\n");
                interval = setInterval(function() {
                    res.write("data: " + (new Date()) + "\n\n");
                }, 6000);

                req.connection.addListener("close", function () {
                    console.log('customer close')
                    clearInterval(interval);
                }, false);
                return
        }

        res.end(fs.readFileSync('./index.html'))
        console.log('listening.......')
        }).listen(80, "127.0.0.1");

    代码解释:

    - 把报头 "Content-Type" 设置为 "text/event-stream"
    - 规定不对页面进行缓存
    - 输出发送数据（始终以 "data: " 开头）

## 自定义事件
onmessage： 默认接收消息事。也可以自定义接收事件，自定义消息事件后，服务端向指定监听的事件推送消息，这时候onmessage事件就会屏蔽。

- 客户端

        source.addEventListener('timeMessage', function(event){
            console.log('自定义消息事件------------',event.data)
        }, false)


- 服务端

        interval = setInterval(function() {
            res.write("event: timeMessage\n");
            res.write("data: " + (new Date()) + "\n\n");
        }, 6000);


## 字段定义解析

- data：数据栏

    ```
        单行以\n\n结尾
        data:  message\n\n

        多行以\n换行，最后一行以\n\n结尾
        data: begin message\n
        data: continue message\n\n

        以发送JSON格式的数据为例。
        data: {\n
        data: "name": "ivin",\n
        data: }\n\n
    ```


- id：数据标识符

    ```
    id: msg1\n
    data: message\n\n
    浏览器用lastEventId属性读取这个值。一旦连接断线，浏览器会发送一个HTTP头，里面包含一个特殊的“Last-Event-ID”头信息，将这个值发送回来，用来帮助服务器端重建连接。因此，这个头信息可以被视为一种同步机制。
    ```


- event栏：自定义信息类型

    ```
    event: foo\n
    data: a foo event\n\n

    自定义foo事件，触发浏览器端的foo事件；默认类型，触发浏览器端的message事件。
    ```

- retry：最大间隔时间

    服务端设置客户端重连的间隔时间，当服务端断开之后，客户端监听了断开后，会间隔retry设定的时间进行重连。


参考
> https://www.cnblogs.com/goody9807/p/4257192.html

