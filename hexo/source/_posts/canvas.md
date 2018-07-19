---
title: canvas面向对象编程
date: 2018-05-21 08:33:10
categories: javascript
tags:
  - canvas
---

经典canvas绘制小彩球

<!-- more -->

<pre>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>canvas colorful ball</title>

  <style>
    #canvas {
      margin: 0 auto;
      display: block;
    }
  </style>
</head>
<body>
<canvas id="canvas">current browser is not support</canvas>
<script>
  /*get canvas*/
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1000;
  canvas.height = 600;
  canvas.style.backgroundColor = '#000';

  /*Ball class*/
  class Ball {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.r = 30;
    }

    /*render ball*/
    render() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }

  }

  /*move mouse action*/
  class MoveBall extends Ball {
    constructor(x, y, color) {
      super(x, y, color);

      this.dX = parseInt(Math.random() * 10 - 5);
      this.dY = parseInt(Math.random() * 10 - 5);
      this.dR = parseInt(Math.random() * 2 + 1);
    }

    update() {
      this.x += this.dX;
      this.y += this.dY;
      this.r -= this.dR;
      if (this.r < 0) this.r = 0;
    }
  }

  let ballArray = [];
  let colorArray = ['red', 'yellow', 'blue', 'purple', 'pink', 'orange'];

  canvas.addEventListener('mousemove', function(e) {
    var e = e || event;
    var colorIndex = parseInt(Math.random() * 5);
    ballArray.push(new MoveBall(e.offsetX, e.offsetY, colorArray[colorIndex]));
  });

  setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(item of ballArray) {
      item.render();
      item.update();
    }
  }, 50);
</script>
</body>
</html>

</pre>


完整代码(非原创)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>canvas colorful ball</title>

  <style>
    #canvas {
      margin: 0 auto;
      display: block;
    }
  </style>
</head>
<body>
<canvas id="canvas">current browser is not support</canvas>
<script>
  /*get canvas*/
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1000;
  canvas.height = 600;
  canvas.style.backgroundColor = '#000';

  /*Ball class*/
  class Ball {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.r = 30;
    }

    /*render ball*/
    render() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }

  }

  /*move mouse action*/
  class MoveBall extends Ball {
    constructor(x, y, color) {
      super(x, y, color);

      this.dX = parseInt(Math.random() * 10 - 5);
      this.dY = parseInt(Math.random() * 10 - 5);
      this.dR = parseInt(Math.random() * 2 + 1);
    }

    update() {
      this.x += this.dX;
      this.y += this.dY;
      this.r -= this.dR;
      if (this.r < 0) this.r = 0;
    }
  }

  let ballArray = [];
  let colorArray = ['red', 'yellow', 'blue', 'purple', 'pink', 'orange'];

  canvas.addEventListener('mousemove', function(e) {
    var e = e || event;
    var colorIndex = parseInt(Math.random() * 5);
    ballArray.push(new MoveBall(e.offsetX, e.offsetY, colorArray[colorIndex]));
  });

  setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(item of ballArray) {
      item.render();
      item.update();
    }
  }, 50);
</script>
</body>
</html>
```

