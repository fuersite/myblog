---
title: webpack
date: 2018-02-03 12:45:25
categories: javascript
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
thumbnailImage: http://fuersite.coding.me/images/webpack.png
tags:
  - webpack
  - javascript
---

webpack 使用与配置
<!-- more -->

[转载] [原文地址][1]
[github] [项目例子][2]
[1]: https://www.jianshu.com/p/42e11515c10f
[2]: https://github.com/fuersite/webpackproject

#### 简介
Webpack 是当下最热门的前端资源模块化管理和打包工具。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分隔，等到实际需要的时候再异步加载。通过 loader 的转换，`任何形式的资源`都可以视作`模块`，比如 CommonJs 模块、 AMD 模块、 ES6 模块、CSS、图片、 JSON、Coffeescript、 LESS 等。

#### 原理
webpack 根据入口文件(比如main.js, index.js 等), 把相关联的资源文件全部打包(通过 require, import 等引入的文件), 所以我们需要做的就是:
1. 指定入口文件.
2. 项目所需的资源文件要直接或者间接的跟入口文件关联上.
3. 设置webpack.config.js配置文件

#### webpack配置讲解
[原文地址][1]已经很详细的举例,这里就只进行配置讲解
下面是我自己的一份配置文件:

项目结构:
![webpacke-project](http://fuersite.coding.me/images/webpackProject.png)

- build 文件夹 里面存放打包好的js文件和生成的项目访问文件index.html
- main.js 项目打包的入口文件
- .babelrc babel配置文件
- package.json 项目依赖配置文件
- webpack.config.js webpack配置文件
- webpack.production.config.js 产品阶段的webpack配置文件与webpack.config.js类似
- 其他的是一些资源文件

<font size= 4 color=#A52A2A>`webpack.config.js`</font>
<pre><code class="javascript">
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry:  __dirname + "/app/main.js",//唯一入口文件
  output: {
      path: __dirname + "/build",
      filename: "bundle[hash].js"
  },
  devtool: 'source-map',
  devServer: {
    contentBase: "./build",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true,//实时刷新
    hot: true //热加载插件
  },
  module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true, // 指定启用css modules
                            localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                        }
                    }
                ]
            },
            {
              test:/\.scss$/,   //表示当前要打包的文件的后缀正则表达式
              use: [{
                loader: "style-loader" // 将 JS 字符串生成为 style 节点
              }, {
                loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
              }, {
                loader: "sass-loader" // 将 Sass 编译成 CSS
              }]
            }
        ]
  },
  plugins: [
    new webpack.BannerPlugin('版权所有，翻版必究'), //在打包的build.js文件中添加注释内容
    new HtmlWebpackPlugin({ filename: 'index.html', template: './index.temp.html' }), // 利用模板文件生成访问的入口文件,可以生成多个,配置不同入口
    new webpack.HotModuleReplacementPlugin(),//热加载插件,
    new ExtractTextPlugin("style.css"), //分离CSS和JS文件
    new webpack.optimize.OccurrenceOrderPlugin(),//为组件分配ID
    new webpack.optimize.UglifyJsPlugin(),//压缩JS代码；
  ]
}

</code></pre>

- entry : 指定打包入口文件,__dirname 指的是当前目录
- output: 指定打包输出文件的路径和文件名,[hash]会生成一段hash值作为文件名一部分
- devtool: 调试工具, 这里我使用'source-map',会生成.map文件
- devServer: 开启一个前端项目服务器可以使用localhost:8080访问项目,不然的话需要手动点击index.html访问.开启服务器可以实时刷新修改
- module: 用来设置一下loader(转化器), babel-loader 可以转换jsx 还有es6成使得浏览器支持的javascript. 添加之后可以使用es6, (main.js中使用import来引入其他资源)
- style-loader css-loader 添加之后可以识别import '.css'文件
- sass-loader 也要配合前面两个使用, 可以使用import '.sccs'文件并且转换为css,也可以识别`<style lang='sass'></style>`这种写法
- loader是webpack里面一个重要配置,需要什么转化器就npm install xxx-loader,然后配置使用
- plugins 插件是一下打包优化的工具

#### 注意事项
- index.html 如何导入打包后的Build.js文件, 如果你配置了HtmlWebpackPlugin会看到生成的index.html已经导入build.js了

```
new HtmlWebpackPlugin({ filename: 'index.html', template: './index.temp.html' }),
```
- 如果没有配置的话, 那么就需要自己手动build.js进index.html. 那么这里就不要hash了
```
  output: {
      path: __dirname + "/build",
      filename: "bundle.js"
  },
```

<font size= 4 color=#A52A2A>`index.tmp.html`</font>
<pre><code class="html">
```
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Webpack Project</title>
    </head>
    <body>
      <div id='root'>
      </div>
    </body>
  </html>
```
</code></pre>

#### package.json

事先安装好package.json中的依赖并且添加到packaage.json中

``` bash
$ npm install xxx --save-dev //添加到devDependencies
或
$ npm install xxx --save //添加到dependencies
```
<font size= 4 color=#A52A2A>`package.json`</font>
<pre><code class="javascript">
{
  "name": "webpackproject",
  "version": "1.0.0",
  "description": "webpack configure",
  "main": "index.js",
  "scripts": {
    "server": "webpack-dev-server --open",
    "start": "webpack",
    "build": "NODE_ENV=production webpack --config ./webpack.production.config.js --progress"

  },
  "author": "ivin",
  "license": "MIT",
  "devDependencies": {
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.2",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.6.1",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-react": "^6.24.1",
    "css-loader": "^0.28.9",
    "extract-text-webpack-plugin": "^3.0.2",
    "html-webpack-plugin": "^2.30.1",
    "node-sass": "^4.7.2",
    "sass-loader": "^6.0.6",
    "style-loader": "^0.20.1",
    "webpack": "^3.10.0",
    "webpack-dev-server": "^2.11.1"
  },
  "dependencies": {
    "react": "^16.2.0",
    "react-dom": "^16.2.0"
  }
}

</code></pre>

