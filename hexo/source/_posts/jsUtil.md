---
title: js 常用开发操作
date: 2018-02-26 15:40:53
categories: javascript
tags:
  - javascript
  - 日期处理
  - 遍历
  - 正则表达式
---

DOM选择，数组排序， 遍历，　去重，　字符串处理，　类型转换，　正则表达式，　日期时间处理, 拷贝, 相等问题
<!--more -->

### DOM 选择
#### js 元素选择器
```
<div name="divName" id="divId" class="divClass"> </div>
```

getElementById()
```
var div = document.getElementById('DivId');
```
getElementsByTagName()
```
var div = document.getElementsByTagName('div');
```
getElementsByName()
```
var div = document.getElementsByName('divName');
```

getElementsByClassName()
```
var div = document.getElementsByClassName('divClass');
```
 document.all 返回所有元素
```
console.log(document.all)
```
#### css 选择器
querySelector返回的是一个对象，querySelectorAll返回的一个集合(NodeList)

```
document.querySelector(".divClass");
document.querySelectorAll(".divClass")[0];
```
#### jquery选择器
```
// 元素选择器
$("p.intro") 选取所有 class="intro" 的 <p> 元素。
// 属性选择器
$("[href='#']") 选取所有带有 href 值等于 "#" 的元素。
// css选择器
$("p").css("background-color","red");
```

### 排序
#### sort() 默认排序顺序是根据字符串Unicode码,默认升序
```
var arr = [4,3,6,5,7,2,'a'];
arr.sort();
(7) [2, 3, 4, 5, 6, 7, "a"]
```
#### sort(function(a,b){})　自定义比较器
```
arr.sort(function(a,b){
return a - b;// 生序，　b-a 降序，升降根据返回正负；
})
```
#### 排序算法
###### `快速排序`
js 实现１

            function quick(arr){
              if(arr.length<=1){
                return arr;
              }
              var left = [];
              var right = [];
              var base = arr[0];
              for(var i=1;i<arr.length;i++)
              {
               // 判决条件
                if(arr[i]>base){
                  right.push(arr[i]);
                }else {
                  left.push(arr[i])
                }
              }
              return quick(left).concat(base,quick(right));
            }


js 实现2


            let swap = function (arr, a, b) {
              arr[a] = arr[a] ^ arr[b];
              arr[b] = arr[a] ^ arr[b];
              arr[a] = arr[a] ^ arr[b];
            }

            function partition(arr, start, end) {
              let key = arr[end];
              while (start < end) {
                while(start < end && arr[start] <= key) {
                  start++;
                }

                if (arr[start] > key) {
                  swap(arr, start, end);
                }

                while(start < end && arr[end] > key) {
                  end--;
                }

                if (arr[end] < key) {
                  swap(arr, start, end);
                }
              }
              return start;
            }

            function quickSort(arr, start, end) {
              if (start == end) return;

              let index = partition(arr, start, end);
              if (index > start) {
                quickSort(arr, start, index - 1);
              }
              if (index < end) {
                quickSort(arr, index + 1, end);
              }
            }

            function sort(_arr) {
              if(!((_arr instanceof Array) && _arr.length)){
                return _arr;
              }

              let arr = _arr.slice();
              quickSort(arr, 0, arr.length - 1);
              return arr;
            }

            let arr = [5,0,4,6,5,10,300,2];
            console.log(sort(arr));

### 遍历
<font size= 4 color=#A52A2A>`for in`</font>适合遍历对象属性，输出键
```
for(var i in arr){
　console.log(i+'   '+arr[i]);//这时的i为键值（string类型），非数组索引
}
```
<font size= 4 color=#A52A2A>`for of ` </font>遍历数组的每一项
```
for(var value of Arr){
    console.log(value);
}
```
<font size= 4 color=#A52A2A> `forEach()`</font> 方法是ES5.1标准引入的
```
arr.forEach(function(v,i){//v==value　为arr项，i==index　为arr索引
    console.log(i+'  'v );
})
```

ES6 提供三个新的方法—— <font size= 4 color=#A52A2A> `entries()，keys(), values()`</font>——用于遍历数组
```
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
```

### 去重
使用`indexOf`
```
function unique1(array){
var n = [];
for(var i = 0; i < array.length; i++){
    if (n.indexOf(array[i]) == -1) n.push(array[i]);
    }
   return n;
}
```
ES6 `Set`集合去重
```
var arr = [...new Set(array)]

```
### 字符串处理
###### 字符串与数组的分分合合
```
var str = "字符串转数组";
var arr = str.split(""); //var arr=s1.split("，")　分割符
//利用数组reverse()方法实现反转
arr.reverse();
//利用数组的join()方法转换为字符串
var str = arr.join("");
console.log(str);
VM1224:3 组数转串符字
```
###### 字符串替换　stringObject.replace(regexp/substr,replacement)
```
var str = "AABBCC";
var　newStr =  str.replace(/BB/, 'cc');
console.log(newStr);
VM1224:3 AAccCC
```
###### json字符串和json对象转换 JSON.parse, JSON.stringify
```
var str = '{"name":"ivin","age":"24"}'
var object = JSON.parse(str);
console.log(object);
var string = JSON.stringify(object);
console.log(staring);
```

### 相等问题
== & ===　& != & !== 进行字符串，整数类型比较
```
let a = 2, b = '2', c = 3;
console.log(a == b); //　true，　值相等就行
console.log(a === b); //　false, 类型也要相同
console.log(a != c); //　true，　只要看值是否相同，
console.log(a !==c ); // true，　值或者类型不相同　都返回true
```
自定义比较数组是否相等(忽略类型和对象数组)
```
Array.prototype.equals = function (arr) {
    if (!arr) { return false;}
    if (this.length !== arr.length) { return false;}
    if (this.lenght === 0 && arr.lenght === 0) { return true;}
    for (var index in  arr) {
        if (this[index] instanceof Array && arr[index] instanceof Array) {
            return this.[index].equals(arr[index]);
        } else if (this.[index] != arr[index]) {
          return false;
        }
    }

    return true;
}
```

### 对象比较
对象的比较个人认为最好是根据业务数据的情况量身定制，这个适用性的比较只能是玩玩

            Object.prototype.equals = function(object2) {
                for (propName in this) {
                    if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
                        return false;
                    }
                    else if (typeof this[propName] != typeof object2[propName]) {
                        return false;
                    }
                }
                for(propName in object2) {
                    if (this.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
                        return false;
                    }
                    else if (typeof this[propName] != typeof object2[propName]) {
                        return false;
                    }

                    if (this[propName] instanceof Array && object2[propName] instanceof Array) {
                       if (!this[propName].equals(object2[propName]))
                                    return false;
                    }
                    else if (this[propName] instanceof Object && object2[propName] instanceof Object) {
                       if (!this[propName].equals(object2[propName]))
                                    return false;
                    }
                    else if(this[propName] != object2[propName]) {
                       return false;
                    }
                }
                return true;
            }



### 拷贝(浅，深copy)
普通变量赋值　var a = b;已经发生了拷贝.
引用类型变量赋值　var a = {name: 'ivin', age: '24'}, a获取到的是地址.
常用的引用类型拷贝有数组拷贝，对象拷贝．

数组拷贝方法一，利用slice()：
```
let array = [1,2,3,4];
let newArray = array.slice();
newArray[2] = 'apple';
console.log('array:', array);
console.log('newArray:', newArray);
结果：
array: (4) [1, 2, 3, 4]
VM72:5 newArray: (4) [1, 2, "apple", 4]
```
对象浅拷贝方法一，for in 变量赋值给另外一个对象,但是对引用类型属性无效
```
var a = {name: 'ivin', age:[2,3,4,5]};
var b = {};
for (index in a) {
  b[index] = a[index];
}
b.age[0] = 1;
console.log(a);
console.log(b);
结果：　如果ａ中的属性也是引用类型，那么赋值给ｂ后，b改变引用型属性，ａ也会改变．这就需要递归来赋值了
```
对象浅拷贝方法二，　ES6　Object.assign方法用于对象的合并
```
var target = { a: 1 };

var source1 = { b: 2 };
var source2 = { c: 3 };

Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
// 进行浅拷贝
var target = {};
var source = {name: 'ivin', age: [2,3,4,5]};
Object.assign(target, source);
target.aget[0] = 1;
console.log(target);
console.log(source);
```
对象深拷贝
```
function deepCopy(obj) {
    if (typeof obj != 'object') {
        return obj;
    }
    if (obj instanceof Array) {
        return obj.slice();
    }
    var newobj = {};
    for ( var attr in obj) {
        newobj[attr] = deepCopy(obj[attr]);
    }
    return newobj;
}
```

### 类型转换
```
null, undefined, "", 0, -0, NaN
//转换成布尔值是false， 剩下的全转化为 ==>> true;
null, "", false, , []
//转换成数字是 ==>> 0;
undefind, "One", 一个非数字值的数组：["a"], function(){}
// 转化成数字是 ==>> NaN;
true, 一个值为数字的数组：[1] , 是数字的字符串："1"，
//转换为数字是 ==>> 1;
```
类型转换有显现跟隐性
```
Boolean(value) - 把给定的值转换成 Boolean 型；
Number(value) - 把给定的值转换成数字（可以是整数或浮点数）；
String(value) - 把给定的值转换成字符串；
parseInt() - 转为Number 保留整数部分
parseFloat() - 转为　Number
valueOf()
toString()
```
Math 方法
```
let num = 1314.45;
Math.floor(num); //向下取整
Math.ceil(num); //向上取整
Math.round(num); // 四舍五入
```

### 正则表达式
var expression = / pattern / flags

`flag`
- g：表示全局（global）模式，即模式将被应用于所有字符串，而非在发现第一个匹配项时立即停止；

- i：表示不区分大小写（case-insensitive）模式，即在确定匹配项时忽略模式与字符串的大小写；

- m：表示多行（multiline）模式，即在到达一行文本末尾时还会继续查找下一行中是否存在与模式匹配的项。

创建RegExp实例两种方式
方式一：正则表达式
```
var pattern1 = /mom( and dad( and baby)?)?/gi
```
方式二：RegExp 对象
```
var pattern2 = new RegExp("mom( and dad( and baby)?)?", "i");
console.log(pattern2.toString()); // 输出：　/mom( and dad( and baby)?)?/gi;
```
RegExp属性方法
pattern.exec(text); 把字符串进行切割分配，返回满足匹配的组项．
```
var text = "mom and dad and baby";
var pattern = /mom( and dad( and baby)?)?/gi;

var matches = pattern.exec(text);
alert(matches.index);     // 0
alert(matches.input);     // "mom and dad and baby"
alert(matches[0]);        // "mom and dad and baby"
alert(matches[1]);        // " and dad and baby"
alert(matches[2]);        // " and baby"
```
pattern.test(text); 检测一个字符串是否匹配某个模式，如果字符串中含有匹配的文本，则返回 true，否则返回 false。
```
var text = "mom and dad and baby";
var pattern = /mom( and dad( and baby)?)?/gi;

var test = pattern.test(text);
console.log(test); // true
```
字符串方法配合Regexp
string.search();//返回匹配patter在text的索引，用于检查字符是否在字符串中
```
var text = "Visit Runoob!";
var pattern＝/Runoob/;
var n = text.search(pattern);　//　n = ６
```
string.replace();
```
var text = "Visit Runoob!";
var pattern＝/Runoob/g;
var n = text.replace(pattern, 'world');　//　Visit word!
```

### 日期时间

时间戳　转为　YYYY-MM-DD hh:mm:ss 格式，　前后端交互时最好传时间戳．
```
function getNowFormatDate(timestamp) {
    var date = timestamp? new Date(timestamp) : new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}
var now = new Date();
var time = now.getTime();
console.log(now);
console.log(getNowFormatDate(time));
结果：
Sun Mar 11 2018 12:42:14 GMT+0800 (CST)
VM11592:22 2018-03-11 12:42:14
```
字符串转日期时间 YYYY-MM-DD hh:mm:ss
原生js,并没有提供转换的API，我们可以借用一个处理时间的库moment.js，
http://momentjs.cn/. 可以传入参数，moment(dataString).format('')；
例子：
```
console.log(moment('Sun Mar 11 2018 14:09:20 GMT+0800 (CST)').format('L'));
// 2018-03-11
```
API:
日期格式化
```
moment().format('MMMM Do YYYY, h:mm:ss a'); // 三月 11日 2018, 1:05:34 下午
moment().format('dddd');                    // 星期日
moment().format("MMM Do YY");               // 3月 11日 18
moment().format('YYYY [escaped] YYYY');     // 2018 escaped 2018
moment().format();                          // 2018-03-11T13:05:34+08:00
相对时间
moment("20111031", "YYYYMMDD").fromNow(); // 6 年前
moment("20120620", "YYYYMMDD").fromNow(); // 6 年前
moment().startOf('day').fromNow();        // 13 小时前
moment().endOf('day').fromNow();          // 11 小时内
moment().startOf('hour').fromNow();       // 6 分钟前
```
日历时间
```
moment().subtract(10, 'days').calendar(); // 2018年3月1日
moment().subtract(6, 'days').calendar();  // 本周一下午1点05
moment().subtract(3, 'days').calendar();  // 本周四下午1点05
moment().subtract(1, 'days').calendar();  // 昨天下午1点05分
moment().calendar();                      // 今天下午1点05分
moment().add(1, 'days').calendar();       // 明天下午1点05分
moment().add(3, 'days').calendar();       // 下周三下午1点05
moment().add(10, 'days').calendar();      // 2018年3月21日
```
多语言支持
```
moment().format('L');    // 2018-03-11
moment().format('l');    // 2018-03-11
moment().format('LL');   // 2018年3月11日
moment().format('ll');   // 2018年3月11日
moment().format('LLL');  // 2018年3月11日下午1点05分
moment().format('lll');  // 2018年3月11日下午1点05分
moment().format('LLLL'); // 2018年3月11日星期日下午1点05分
moment().format('llll'); // 2018年3月11日星期日下午1点05分
```
