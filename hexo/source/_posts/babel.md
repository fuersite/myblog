---
title: babel使用讲解
date: 2019-07-30 22:19:49
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
thumbnailImage: http://fuersite.coding.me/images/babel.png
categories: js
tags:
  - babel
---
babel完全剖析
<!--more-->

#### [babel官网文档](https://www.babeljs.cn/docs/) 

------

其实官网文档已经很详尽了，但是里面涉及到的内容概念比较多，对于初学者来说看了还是很多不明白地方。就个人经验讲解其中的关键点，有不足之处还请提点。

## 什么是babel
Babel 是一个 JavaScript 编译器,通过 Polyfill 方式在目标环境中添加缺失的特性 (通过 @babel/polyfill 模块)将 ECMAScript 2015+ 版本的代码转换为向后兼容的JavaScript语法。（其实就是把一些新的api，实例方法通过转化能兼容旧的浏览器。）

-----

## babel核心——babel-core
babel-core 是babel转换的核心，转化es2015+时候就是使用babel-core的辅助函数进行一些基本的语法转化，webpack的babel-loader就是调用这些API来完成转译过程的。

## 转化工具 babel-cli 
babel的转化工具，babel-cli自带babel-node。利用工具调用bable-core函数进行es6文件转化。
```
babel-node script.js
```
-----

## 为什么要使用@babel/polyfill
`babel-core`里面其实给浏览器提提供了新Api,如promise,Set等，但是  Babel默认只转换新的JavaScript语法（syntax），如箭头函数等，如比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码，因此我们需要polyfill. `babel/polyfill` 其实只是包含了 `regenerator runtime` 和 `core-js`。

## 如何使用@babel/polyfill

- 安装:

```
    npm install --save babel-polyfill 
```

- 方式一（入口文件引入）：
 ```
 import "babel-polyfill"
 ```

- 方式二webpack配置：

```
entry: ["babel-polyfill", "./app/js"] };
```



## 理解transform-runtime和babel-runtime

babel-plugin-transform-runtime插件依赖babel-runtime，babel-runtime是真正提供runtime环境的包（core-js才是runtime的核心）。也就是说使用transform-runtime其实也是core.js在起作用。 transform-runtime>babel-runtime>core.js相互依赖包含关系。

## @babel/polyfill和transform-runtime的区别

有了polyfill为什么还要transform-runtime,这就要从他们的转化原理讲起了。

### @babel/polyfill

babel-polyfill会把ES2015+环境整体引入到你全局代码环境中，让你的代码可以直接使用新标准所引入的新原生对象，新API等,在全局添加新的API对象。
例如： 
```
// 输入的ES6代码
var _promise = new Promise()
// 通过 @babel/polyfill
window.Promise = (...)
var _promise = new Promise()
```
### transform-runtime
runtime不会污染全局环境，会在局部进行polyfil，使用局部方法替换。所以一些实例方法转换不了，[1,23,40].includes(40)。
```
// es6
let _promise = new Promise()
// 通过 @babel-transform-runtime
var _promise = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a()
```

## @babel/polyfill 、transform-runtime 如何抉择

- 如果是对外发布npm等，建议使用transform-runtime，不会造成全局变量污染。如果应用项目中不使用些实例方法，如'fgrty'.includes('22'),使用还是没问题的。
- 如果在实际的应用中，建议还是使用polyfill，但是引入polyfill包有点大(100kb左右),不过现在已经有优化方法了，后面会讲到。

## 使用transform-runtime 还是报错`Promise 未定义`
babel-runtime 其实已经转了,但因为是局部转换，所以npm包中如果使用了Promise就不能转换了。解决方法如下：
```
// 将Promise抛出为全局对象，类polyfill
window.Promise = Promise
// 使用transform-runtime 转换后
window.Promise = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a()
```

# 配置文件使用
项目中添加`babel.config.js、babel.js、.babelrc`等都可以，这里主要讲解.babelrc使用，其他自行去GB.这里有一份，babelrc配置：

```
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "stage-2"
  ],
  "plugins": ["transform-vue-jsx", "transform-runtime"]
}

```

### plugins 

用来加载一些转换的插件，可以自定义有针对性的使用插件转换一些特定代码。例如：
transform-es2015-arrow-functions 箭头函数插件
...还有很多es2015-*插件
transform-remove-console  移除console.*

### presets 预设
es6转换我们可以使用插件就可以完成的，但是插件功能过于细分，一个项目当中我们可能要加载很多插件这样很麻烦，为了解决这个问题presets就出现了。

- presets工具就是把一部分插件的功能集中起来放到一个包里面，就是一个大插件。例如：
babel-preset-ess2015 里面就包含了绝大部分transform-es2015-* 插件，满足开发需求。只需安装对应的preset插件就可以使用了。

- 我们了解的presets哪些呢？
es2015/es2016/es2017/latest/react/stage-x(stage-0/1/2/3/4)
具体功能可以自己去搜索一下。

- 最新的babel-preset-env (babel7推荐使用，按需配置)
babel-preset-env以根据配置的目标浏览器或者运行环境来自动将ES2015+的代码转换为es5，这样就需要自己去添加preset-es201x那么多了，自动匹配转换。但是stage-x在babel7直接删除了。

### babel-preset-env 配置
- targets
- targets.node // 指定版本
- targets.browsers // 指定浏览器版本
- spec : 启用更符合规范的转换，默认为 false
- loose：是否使用 loose mode，默认为 false
- modules：将 ES6 module 转换为其他模块规范，可选 "adm" | "umd" | "systemjs" | "commonjs" | "cjs" | false，默认为 false
- debug： 启用debug，默认 false
- include：一个包含使用的 plugins 的数组
- exclude：一个包含不使用的 plugins 的数组
- useBuiltIns：为 polyfills 应用 @babel/preset-env ，可选 "usage" | "entry" | false，默认为 false
```
"presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]，
        node： "current"
      },
      useBuiltIns: 'usage'
    }],
    "stage-2"
  ],
```

### babel-preset-env 与polyfill配合使用
babel-preset-env 的属性设为 `useBuiltIns:usage`，polyfill则会按需引入而不是把整个包添加到全局，减小代码体积。

------

感谢大家花时间阅读，上面部分内容有借鉴他人，具体未署名，有问题可联系我进行删改。

- 参阅
https://www.babeljs.cn/docs/
https://www.jianshu.com/p/e9b94b2d52e2
https://www.cnblogs.com/wonyun/p/8076453.html
https://excaliburhan.com/post/babel-preset-and-plugins.html