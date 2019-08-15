---
title: 贝塞尔曲线javascript
date: 2019-02-18 22:19:49
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
tags:
  - javascript
---

贝塞尔三阶曲线动画
<!-- more -->

#### 源码鉴赏

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>besier 贝塞尔曲线应用</title>
    <style>
        .level-1 {
            height: 200px;
            width: 100%;
            background: rgb(125, 203, 223);
            color: #fff;
            position: relative;
        }
        .level-2 {
            margin-top: 30px;
            height: 200px;
            width: 100%;
            background: rgb(214, 100, 47);
            color: #fff;
            position: relative;
        }

        .level-3 {
            margin-top: 30px;
            height: 200px;
            width: 100%;
            background: rgb(12, 207, 110);
            color: #fff;
            position: relative;
        }

        .level-3-ball {
            position:absolute;
            width:16px;
            height:16px;
            overflow:hidden;
            border-radius: 50%;
            background-color:#FF0000;
            display: none;
        }
    </style>
</head>
<body>
    <div class="level-1">
        <span>一阶贝塞尔曲线</span>
        <div id="level1-ball" class="level-3-ball"></div>
    </div>
    <div class="level-2">
        <span>二阶贝塞尔曲线</span>
        <div id="level2-ball" class="level-3-ball"></div>
    </div>
    <div class="level-3">
        <span>三阶贝塞尔曲线</span>
        <div id="level3-ball" class="level-3-ball"></div>
    </div>
         
    <script type="text/javascript">
        var path1 = [];
        var ball1 = document.getElementById("level1-ball");

        var path2 = [];
        var ball2 = document.getElementById("level2-ball");

        var path3 = [];
        var ball3 = document.getElementById("level3-ball");
    
        function Point2D(x,y) {
            this.x=x||0.0;
            this.y=y||0.0;
        }

        /**
            一阶曲线
            P0為起始點
            p1為第一個终点
            t為參數值，0 <= t <= 1
        */
        function bezierLevel1( points, t ) {
            var	result = new Point2D
            var p0 = points[0]
            var p1 = points[1]

            result.x = (1 - t) * p0.x + t * p1.x
            result.y = (1 - t) * p0.y + t * p1.y

            return result
        }

        /**
            二阶曲线
            P0為起始點
            p1為第一個控制點
            p2為第二個终点
            t為參數值，0 <= t <= 1
        */
        function bezierLevel2( points, t ) {
            var	result = new Point2D
            var p0 = points[0]
            var p1 = points[1]
            var p2 = points[2]

            result.x = Math.pow((1 - t),2) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x
            result.y = Math.pow((1 - t),2) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y

            return result
        }
    
        /**
            三阶曲线
            P0為起始點
            p1為第一個控制點
            p2為第二個控制點
            p3為結束點
            t為參數值，0 <= t <= 1
        */
        function bezierLevel3( points, t ) {
            var	result = new Point2D
            var p0 = points[0]
            var p1 = points[1]
            var p2 = points[2]
            var p3 = points[3]

            result.x = p0.x * Math.pow((1 - t),3) + 3 * p1.x * t * (Math.pow((1 - t),2)) +  3 * p2.x * t * t * (1 - t) + p3.x * Math.pow(t, 3)
            result.y = p0.y * Math.pow((1 - t),3) + 3 * p1.y * t * (Math.pow((1 - t),2)) +  3 * p2.y * t * t * (1 - t) + p3.y * Math.pow(t, 3)
        
            return result;
        }

        function computeBezier(pointNum, path, points, bezierLevel) {
            var dt= 1.0 / ( pointNum - 1 )
            for( var i = 0; i < pointNum; i++) {
                path[i] = bezierLevel( points, i * dt )
            }
        }

        function setTimer(ball, path3) {
            var i = 0 
            ball.style.left = path3[0].x + 'px'
            ball.style.top = path3[0].y + 'px'
            ball.style.display = 'block'

            setInterval(function () {
                var j = (i<100) ? i : (199-i)
                ball.style.left = path3[j].x +'px'
                ball.style.top = path3[j].y +'px'
                if(++i==200)i=0
            }, 30);
        }

        // 一阶
        var points1 = [new Point2D(20, 0), new Point2D(600, 184)]
        computeBezier(100, path1, points1, bezierLevel1)
        setTimer(ball1, path1)

        // 二阶
        var points2 = [new Point2D(20, 160), new Point2D(100, -100), new Point2D(600, 160)]
        computeBezier(100, path2, points2, bezierLevel2)
        setTimer(ball2, path2)

        // 三阶
        var points3 = [new Point2D(20, 100), new Point2D(300, -100), new Point2D(600, 300), new Point2D(600, 100)]
        computeBezier(100, path3, points3, bezierLevel3)
        setTimer(ball3, path3)
    </script>
</body>
</html>
```

#### 动画演示

<pre>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>besier 贝塞尔曲线应用</title>
    <style>
        .level-1 {
            height: 200px;
            width: 100%;
            background: rgb(125, 203, 223);
            color: #fff;
            position: relative;
        }
        .level-2 {
            margin-top: 30px;
            height: 200px;
            width: 100%;
            background: rgb(214, 100, 47);
            color: #fff;
            position: relative;
        }

        .level-3 {
            margin-top: 30px;
            height: 200px;
            width: 100%;
            background: rgb(12, 207, 110);
            color: #fff;
            position: relative;
        }

        .level-3-ball {
            position:absolute;
            width:16px;
            height:16px;
            overflow:hidden;
            border-radius: 50%;
            background-color:#FF0000;
            display: none;
        }
    </style>
</head>
<body>
    <div class="level-1">
        <span>一阶贝塞尔曲线</span>
        <div id="level1-ball" class="level-3-ball"></div>
    </div>
    <div class="level-2">
        <span>二阶贝塞尔曲线</span>
        <div id="level2-ball" class="level-3-ball"></div>
    </div>
    <div class="level-3">
        <span>三阶贝塞尔曲线</span>
        <div id="level3-ball" class="level-3-ball"></div>
    </div>
         
    <script type="text/javascript">
        var path1 = [];
        var ball1 = document.getElementById("level1-ball");

        var path2 = [];
        var ball2 = document.getElementById("level2-ball");

        var path3 = [];
        var ball3 = document.getElementById("level3-ball");
    
        function Point2D(x,y) {
            this.x=x||0.0;
            this.y=y||0.0;
        }

        /**
            一阶曲线
            P0為起始點
            p1為第一個终点
            t為參數值，0 <= t <= 1
        */
        function bezierLevel1( points, t ) {
            var	result = new Point2D
            var p0 = points[0]
            var p1 = points[1]

            result.x = (1 - t) * p0.x + t * p1.x
            result.y = (1 - t) * p0.y + t * p1.y

            return result
        }

        /**
            二阶曲线
            P0為起始點
            p1為第一個控制點
            p2為第二個终点
            t為參數值，0 <= t <= 1
        */
        function bezierLevel2( points, t ) {
            var	result = new Point2D
            var p0 = points[0]
            var p1 = points[1]
            var p2 = points[2]

            result.x = Math.pow((1 - t),2) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x
            result.y = Math.pow((1 - t),2) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y

            return result
        }
    
        /**
            三阶曲线
            P0為起始點
            p1為第一個控制點
            p2為第二個控制點
            p3為結束點
            t為參數值，0 <= t <= 1
        */
        function bezierLevel3( points, t ) {
            var	result = new Point2D
            var p0 = points[0]
            var p1 = points[1]
            var p2 = points[2]
            var p3 = points[3]

            result.x = p0.x * Math.pow((1 - t),3) + 3 * p1.x * t * (Math.pow((1 - t),2)) +  3 * p2.x * t * t * (1 - t) + p3.x * Math.pow(t, 3)
            result.y = p0.y * Math.pow((1 - t),3) + 3 * p1.y * t * (Math.pow((1 - t),2)) +  3 * p2.y * t * t * (1 - t) + p3.y * Math.pow(t, 3)
        
            return result;
        }

        function computeBezier(pointNum, path, points, bezierLevel) {
            var dt= 1.0 / ( pointNum - 1 )
            for( var i = 0; i < pointNum; i++) {
                path[i] = bezierLevel( points, i * dt )
            }
        }

        function setTimer(ball, path3) {
            var i = 0 
            ball.style.left = path3[0].x + 'px'
            ball.style.top = path3[0].y + 'px'
            ball.style.display = 'block'

            setInterval(function () {
                var j = (i<100) ? i : (199-i)
                ball.style.left = path3[j].x +'px'
                ball.style.top = path3[j].y +'px'
                if(++i==200)i=0
            }, 30);
        }

        // 一阶
        var points1 = [new Point2D(20, 0), new Point2D(600, 184)]
        computeBezier(100, path1, points1, bezierLevel1)
        setTimer(ball1, path1)

        // 二阶
        var points2 = [new Point2D(20, 160), new Point2D(100, -100), new Point2D(600, 160)]
        computeBezier(100, path2, points2, bezierLevel2)
        setTimer(ball2, path2)

        // 三阶
        var points3 = [new Point2D(20, 100), new Point2D(300, -100), new Point2D(600, 300), new Point2D(600, 100)]
        computeBezier(100, path3, points3, bezierLevel3)
        setTimer(ball3, path3)
    </script>
</body>
</html>
</pre>