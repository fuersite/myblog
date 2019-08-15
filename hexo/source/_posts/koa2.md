---
title: koa2 使用
date: 2018-03-30 18:23:40
categories: node
tags:
  - node
  - koa2
---

ko2 从零到亿
<!-- more -->
- 当前环境:
   ubuntu: 14.04
   Node: v8.9.0
   npm: 5.8.0

-------

对于node开发一直很是向往，一直想探索一下这片不一样的神秘蓝天，然而工作的项目很少有接触到的,　但这并不能阻止我们对未知的探索，虽然不知这条路通向何方，也不知道终点是什么，我们期待的是surprise and challenge. If you have a interest, follow me.

### koa2项目搭建
-----
`注`:　命令基本上在终端执行的

1.创建node-koa项目目录
```
$ mkdir node-koa
$ cd node-koa
```
２.npm初始化项目
```
$ npm init         //创建package.json文件
```

３.安装koa2
```
$ npm install koa@2 --save
```

４.安装路由
```
$ npm install koa-router --save
```
5.创建入口文件`index.js`,　内容如下：
```
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```
6.测试：
在终端执行`node index.js`, 然后在浏览器访问`localhost:3000`
会显示：　hello word


### ES6使用package.json初始配置
1引入babel
&emsp;&emsp;使用es6部分语法时，node环境和浏览器环境存在兼容性问题，使用babel进行转换．

- babel-register
- babel-polyfill
- babel-preset-es2015
```
$ npm i babel-register babel-polyfill babel-preset-es2015 --save
```
在`index.js`引入
```
const babel = require('babel-register')
const babelPoly = require('babel-polyfill')
const router = require('./router')
const Koa = require('koa')
const app = new Koa()
```
在项目目录下创建.babelrc， 内容如下：
```
{
    "presets": ["es2015"] // 转码规则，之前安装了babel-preset-es2015
}
```
2.package.json初始配置：
```
{
  "name": "koa-node",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "node index.js"
  },
  "author": "ivin",
  "license": "ISC",
  "dependencies": {
    "koa": "^2.5.0",
    "koa-router": "^7.4.0"
  },
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-polyfill": "^6.26.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-register": "^6.26.0"
  }
}
```
使用script配置一下脚本命令，之前启动项目使用`node　index.js`，现在我们把命令配置到里面去．只需在终端执行：
```
$ npm run dev
```
项目启动后,可以在非入口文件中使用es6语法了, `注意` index.js 中还有要使用原生语法,因为babel时在index才引入的.

### 路由
1. 编写route.js 文件
  ——　这里编写了两个路由，一个同步，一个异步。

  <pre><code class="javascript">
    const Router = require('koa-router')
    const router = new Router()

    router.get('/user/profile', 'Hi client')
    router.get('/user', async ctx => {
      const sleep = async (ms) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let data = 'welcome Koa2'
            resolve(data)
          }, ms)
        } )
      }
      ctx.body = await sleep(4000)
    })

    module.exports = router
  </code></pre>

2. 在index.js 中引入route文件

  <pre><code  class="javascript">
    const router = require('./router')
    app
      .use(router.routes())
      .use(router.allowedMethods())
  </code></pre>

3. 浏览器访问：　http://localhost:3000/user， 返回　welcome Koa2


### 上下文(Context)
Koa Context 将 node 的 request 和 response 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法。 这些操作在 HTTP 服务器开发中频繁使用，它们被添加到此级别而不是更高级别的框架，这将强制中间件重新实现此通用功能。
_每个_ 请求都将创建一个 Context，并在中间件中作为接收器引用，或者 ctx 标识符，如以下代码
<pre><code  class="javascript">
app.use(async (ctx, next) => {
  console.log('first11 context', '-----------------------------------')
  await next()
  console.log('first12 context', '-----------------------------------')
})
app.use(ctx => {
  console.log('second21 context', '----------------------------------')
})
</code></pre>
执行结果：

```
first11 context -----------------------------------
second21 context ----------------------------------
first12 context -----------------------------------

```
其实中间件很像我们所熟悉的拦截器，　执行顺序　Ａ --wait-> B --wait-> C--(done request and response) --callback-> B --callback-> A.
经过middleware层层过滤后在处理请求，处理完后，在进行回调。如果前面有中间层进行response了就不会再执行后面的middleware
所以你需要吧处理请求(route)的放到最后处理,　路由（route）也是作为一个中间件在应用程序中。看下面代码：
<pre><code  class="javascript">
  app.use(async (ctx, next) => {
    console.log('first11 context', '-----------------------------------')
    await next()
    console.log('first12 context', '-----------------------------------')
  })
  app.use(async (ctx, next) => {
    console.log('second21 context', '----------------------------------')
    await next()
  })
  app
    .use(router.routes())
    .use(router.allowedMethods())
</code></pre>
middleware 使用await async 异步进行了级联

