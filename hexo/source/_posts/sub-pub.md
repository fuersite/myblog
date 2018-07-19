---
title: 原生javascript 实现数据双向绑定
date: 2018-05-15 16:54:35
categories: javascript
tags:
  - javascript
  - 事件
---

发布-订阅者模式
<!-- more -->

### 双向数据绑定
自从Angularjs 问世以来，给前端的开发带来了一场巨大的变革， 它最大的特点就是实现了数据的双向绑定，减少了对DOM的操作。
以前你可能需要写很多getElementBy...（）之类的操作，但是现在如果使用一些实现数据绑定的框架angularjs,vue,react 等。你只需把你的变量绑定到DOM上，只需要改变变量就可以改变DOM上显示值，是不是很方便呀，如果没有接触过的赶紧去体验一下吧。

### 原生javascript 实现数据双向绑定
有些人就是手痒，明明已经有人实现了这种操作全世界都再用，偏要自己手动去实现一下，而我们就是这种人。
虽然我也在网上看到过一些同学实现，但是实现都不够完美，不符合我的心意，那就在来一遍吧。
首先我们想象一下数据双向绑定的效果：
- 假设把一个变量a绑定到一个dom或者多个dom上
- 其中一个dom上的值改变，其他绑定了a的dom上的值也会改变，a的值也会改变
- 如果在js中改变a的值，那么所有绑定了a的dom上的值也会相应改变

------

哈哈 接下来我们就要准备好我们所需要的材料了。。。。。。

#### step1: 我们准备几个演示的DOM
两个input， 一个div. 这样设计目的，可以实现我们之前想象的效果，慧眼如炬的你已经发现了他们有点不同是么？
里面有一个model的属性，而原生html是没有这个属性的. 没错, 这个model就是我们用来绑定变量的attriName, watch就是我们绑定的变量。

```html
  <form>
    <input type="text" model="watch">
    <input type="text" model="watch">
  </form>
  <div model="watch" style="width: 100px; height: 30px;top: 100px;"></div>
```
-----

#### step2: 事件订阅
在上一步中我们已经暴露出了model, watch，那么这一个我们就要实现他们的真正绑定。
首先我们定义了在html中绑定的属性名称attriName

```javascript
  var bind_prefix = 'model';
```
然后我们要建立一个订阅-发布的事件模型，handles用来存放事件， on用来订阅添加事件，emit用来发布执行事件。bindName其实就是我们上一步input中的model的属性值watch，也就是说这两个input订阅了
一个watch的事件。

```javascript
var bindEvent = {
  handles: {},
  on: function (bindName, callback) {
    this.handles[bindName] = this.handles[bindName] || [];
    this.handles[bindName].push(callback);
  },
  emit: function (bindName, value) {
    for (var callback of this.handles[bindName] ) {
      callback(bindName, value);
    }
  }
};
```

我们需要在初始化的时候就把这些事件添加进handles里面，这样才能在操作时候触发。

```javascript
      var propNames = new Set();
      var elements = document.querySelectorAll("[" + bind_prefix + "]");//获取所以有model属性元素

      for(var i = 0, len =elements.length; i < len; i++) {
        propNames.add(elements[i].getAttribute(bind_prefix)); //因为model绑定的值（变量）不一样，而我们把这个值作为事件名，这时候需要去重
      }

      for (var propName of propNames) {
        bindEvent.on(propName, callback); //进行事件订阅，callback是触发事件后的回调函数
      }

```

#### step3: 事件发布
我们想象一下，当我们改变input内容的时候要触发事件，那么我们是不是需要一个监听事件，这个是必然的,监听全局，然后过滤出有model属性的dom,
进行事件的发布。

```javascript

    var changeHandler = function(event){
      var target = event.target || event.srcElemnt,
      propName = target.getAttribute(bind_prefix);

      if(propName && propName !== ""){
        bindEvent.emit(propName, target.value);
      }
    }

    if(document.addEventListener){
      document.addEventListener("keyup",changeHandler, false);
    }else{
      document.attachEvent("onkeyup",changeHandler);
    }

```
在添加了全局监听之后，如果改变input就会触发事件并且获取到最新值target.value，进一步执行bindEvent.emit(), 在里面会执行一个callback，这个callback才是我们完成数据改变的关键步骤。
下面这个代码就应该容易懂了，对于form的元素会有value值，div,span等的话需要使用innerHTML或者innerText

```javascript
    var callback = function(propName, newValue){
      var elems = document.querySelectorAll("[" + bind_prefix + "=" + propName + "]");
      for(var i = 0,len =elems.length; i < len; i++) {
        tagName = elems[i].tagName.toLowerCase();
        if(tagName === "input" || tagName === "textarea" || tagName === "select"){
          elems[i].value = newValue;
        } else {
          elems[i].innerHTML = newValue;
        }
      }
    };
```
当我们把上面的代码组合起来时，就可以实现dom直接的相互作用，相互改变。一个input值改变，其他相同绑定的dom也会发生改变。

但是 。。。。。。。。。
这还不够
现在只是dom之间相互改变，还没有涉及到变量的改变，数据的双向绑定是改变变量，那么绑定了该变量的dom也会改变，改变dom值时，相应的变量也会改变。

#### step4: 实现变量与dom之间的相互改变
怎么做？ 这个就需要用到一个Object.defineProperty(), 使用里面的set, get方法。
不熟悉这个方法的同学可以去了解一下，当 this.watch= 'hello'，时会执行set方法，当调用this.watch时会执行get方法。
然后我们需要在初始化时候给每一个绑定的变量执行这个方法。

```javascript
    var bindModel = function (scope, property) {
      var elems = document.querySelectorAll("[" + bind_prefix + "=" + property + "]") || [];
      if(!scope.hasOwnProperty(property)) {
        Object.defineProperty(scope, property, {
          get: function() {
            tagName = elems[0].tagName.toLowerCase();
            if(tagName === "input" || tagName === "textarea" || tagName === "select"){
              return elems[0].value;
            } else {
              return elems[0].innerHTML;
            }
            return elem.value;
          },
          set: function(newValue) {
            for (var i = elems.length - 1; i >= 0; i--) {
              tagName = elems[i].tagName.toLowerCase();
              if(tagName === "input" || tagName === "textarea" || tagName === "select"){
                elems[i].value = newValue;
              } else {
                elems[i].innerHTML = newValue;
              }
            }
          },
          writeable: true,
          configurable: true
        });
      }
    };
```

### 完全代码： 复制可用, 欢迎copy

```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>sub-pub</title>
    </head>
    <body>
    <form>
      <input type="text" model="watch">
      <input type="text" model="watch">
    </form>
    <div model="watch" style="width: 100px; height: 30px;top: 100px;"></div>
    <script>
    var bind_prefix = 'model';
    vm = this

    var bindEvent = {
      handles: {},
      on: function (bindName, callback) {
        this.handles[bindName] = this.handles[bindName] || [];
        this.handles[bindName].push(callback);
      },
      emit: function (bindName, value) {
        for (var callback of this.handles[bindName] ) {
          callback(bindName, value);
        }
      }
    };

    var changeHandler = function(event){
      var target = event.target || event.srcElemnt,
      propName = target.getAttribute(bind_prefix);

      if(propName && propName !== ""){
        bindEvent.emit(propName, target.value);
      }
    };

    var callback = function(propName, newValue){
      var elems = document.querySelectorAll("[" + bind_prefix + "=" + propName + "]");
      for(var i = 0,len =elems.length; i < len; i++) {
        tagName = elems[i].tagName.toLowerCase();
        if(tagName === "input" || tagName === "textarea" || tagName === "select"){
          elems[i].value = newValue;
        } else {
          elems[i].innerHTML = newValue;
        }
      }
    };

    var bindModel = function (scope, property) {
      var elems = document.querySelectorAll("[" + bind_prefix + "=" + property + "]") || [];
      if(!scope.hasOwnProperty(property)) {
        Object.defineProperty(scope, property, {
          get: function() {
            tagName = elems[0].tagName.toLowerCase();
            if(tagName === "input" || tagName === "textarea" || tagName === "select"){
              return elems[0].value;
            } else {
              return elems[0].innerHTML;
            }
            return elem.value;
          },
          set: function(newValue) {
            for (var i = elems.length - 1; i >= 0; i--) {
              tagName = elems[i].tagName.toLowerCase();
              if(tagName === "input" || tagName === "textarea" || tagName === "select"){
                elems[i].value = newValue;
              } else {
                elems[i].innerHTML = newValue;
              }
            }
          },
          writeable: true,
          configurable: true
        });
      }
    };

    var init = function () {
      var propNames = new Set();
      var elements = document.querySelectorAll("[" + bind_prefix + "]");

      for(var i = 0, len =elements.length; i < len; i++) {
        propNames.add(elements[i].getAttribute(bind_prefix));
      }

      for (var propName of propNames) {
        bindEvent.on(propName, callback);
        bindModel(this, propName);
      }

      if(document.addEventListener){
        document.addEventListener("keyup",changeHandler, false);
      }else{
        document.attachEvent("onkeyup",changeHandler);
      }
    };

    init();
    vm.watch = "hello";

    </script>
    </body>
    </html>
```

### 效果演示：
watch 初始值 hello
<pre>
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>sub-pub</title>
    </head>
    <body>
    <form>
      <input type="text" model="watch">
      <input type="text" model="watch">
    </form>
    <div model="watch" style="width: 100px; height: 30px;top: 100px;"></div>
    <script>
    var bind_prefix = 'model';
    vm = this

    var bindEvent = {
      handles: {},
      on: function (bindName, callback) {
        this.handles[bindName] = this.handles[bindName] || [];
        this.handles[bindName].push(callback);
      },
      emit: function (bindName, value) {
        for (var callback of this.handles[bindName] ) {
          callback(bindName, value);
        }
      }
    };

    var changeHandler = function(event){
      var target = event.target || event.srcElemnt,
      propName = target.getAttribute(bind_prefix);

      if(propName && propName !== ""){
        bindEvent.emit(propName, target.value);
      }
    };

    var callback = function(propName, newValue){
      var elems = document.querySelectorAll("[" + bind_prefix + "=" + propName + "]");
      for(var i = 0,len =elems.length; i < len; i++) {
        tagName = elems[i].tagName.toLowerCase();
        if(tagName === "input" || tagName === "textarea" || tagName === "select"){
          elems[i].value = newValue;
        } else {
          elems[i].innerHTML = newValue;
        }
      }
    };

    var bindModel = function (scope, property) {
      var elems = document.querySelectorAll("[" + bind_prefix + "=" + property + "]") || [];
      if(!scope.hasOwnProperty(property)) {
        Object.defineProperty(scope, property, {
          get: function() {
            tagName = elems[0].tagName.toLowerCase();
            if(tagName === "input" || tagName === "textarea" || tagName === "select"){
              return elems[0].value;
            } else {
              return elems[0].innerHTML;
            }
            return elem.value;
          },
          set: function(newValue) {
            for (var i = elems.length - 1; i >= 0; i--) {
              tagName = elems[i].tagName.toLowerCase();
              if(tagName === "input" || tagName === "textarea" || tagName === "select"){
                elems[i].value = newValue;
              } else {
                elems[i].innerHTML = newValue;
              }
            }
          },
          writeable: true,
          configurable: true
        });
      }
    };

    var init = function () {
      var propNames = new Set();
      var elements = document.querySelectorAll("[" + bind_prefix + "]");

      for(var i = 0, len =elements.length; i < len; i++) {
        propNames.add(elements[i].getAttribute(bind_prefix));
      }

      for (var propName of propNames) {
        bindEvent.on(propName, callback);
        bindModel(this, propName);
      }

      if(document.addEventListener){
        document.addEventListener("keyup",changeHandler, false);
      }else{
        document.attachEvent("onkeyup",changeHandler);
      }
    };

    init();
    vm.watch = "hello";

    </script>
    </body>
    </html>
</pre>

### 缺陷
1. 代码不够健壮，随手而为。
2. 目前只做了string类型数据双向绑定， 不支持对象，数组等复杂数据结构。
