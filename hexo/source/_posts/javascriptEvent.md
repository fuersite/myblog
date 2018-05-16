---
title: js 自定义事件
date: 2018-05-11 14:02:41
categories: javascript
tags:
  - javascript
  - 事件
---

create own event and add watch
<!-- more -->
javascript中常使用的事件类型主要是HTML事，DOM事件，设备事件等等．但是有时候对于一些复杂的交互涉及到页面之间数据传输等，光只用DOM的事件是远远不够的，而且事件监听混乱．这时候就需要我们自定义事件，灵活，可拓展性使用

### DOM操作事件

1.模式
<pre><code class="javascript">
element.addEventListener(type, handler, false)//false表示在冒泡阶段处理事件，默认false
</code></pre>

2.兼容事件处理Util

<pre><code class="javascript">
  // 跨浏览器兼容事件
  var EventUtil = {
    addHandler: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    },
    getEvent: function(event){
        return event ? event : window.event;
    },
    getTarget: function(event){
        return event.target || event.srcElement;
    },
    preventDefault: function(event){
        if (event.preventDefault){
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    stopPropagation: function(event){
        if (event.stopPropagation){
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    }
  };

</code></pre>

### 广义观察者

1.发布-订阅者模式

<pre><code class="javascript">
  $on('eventName', callback)
  $emit('eventName'，data)
</code></pre>

2.自定义Event

<pre><code class="javascript">
  var customeEvent = {
    on: function (eventName, callback) {
      if (!this.handles) {
        Object.defineProperty(this, handles, {
          configurable: false, //true , can modify by defineProperty
          writable: true, //true , can modity this value
          enumerable: false, //false, can not get this property by for in  or Object.keys()
          value: {}
        })
        this.handles = {};
      }
      if (!this.handles[eventName]) {
        this.handles[eventName] = [];
      }
      this.handles[eventName].push(callback);
    },
    emit: function(eventName, data) {
      var message = arguments[1];
      if (this.handles && this.handles[eventName]) {
        this.handles[eventName].map(function(callback) {
          callback(message);
        })
      }
    },
    removeEvent: function(eventName) {
      if (this.handles && this.handles[eventName]) {
        delete this.handles[eventName]
      }
    }
  };
</pre></code>

### index.html

```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>custome event</title>
    <script src="./lib/Event.js"></script> // import customeEvent EventUtil
    <script>
      customeEvent.on('event', function(data){
        console.log('I am first', data);
      });

      customeEvent.on('event', function(data){
        console.log('I am second', data);
      });

      customeEvent.on('test', function(data){
        console.log('I am listening', data);
      });
    </script>
  </head>
  <body>
  <div><button id="mybtn" style="width: 100px; height: 30px; background-color: red;">EventUtil</button></div>
  <script>
    ;(function() {
      var mybtn = document.getElementById('mybtn');
      EventUtil.addHandler(mybtn, 'click', function(event){
        alert('DOM Event');
      });
      customeEvent.emit('event', 'listening custom event');
      customeEvent.emit('test', 'test custom event');
    })()
  </script>
  </body>
  </html>
```

### run
```
I am first listening custom event
I am second listening custom event
I am listening test custom event

```
