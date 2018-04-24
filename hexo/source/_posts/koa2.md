---
title: koa2
date: 2018-03-30 18:23:40
categories: node
tags:
  - node
  - koa2
---

# ko2起步与成圣之路
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
项目启动

### 使用路由访问
