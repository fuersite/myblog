---
title: js 常用开发操作
date: 2018-02-26 15:40:53
categories: javascript
tags:
  - util
  - javascript
  - 日期处理
  - 遍历
  - 正则表达式
---

DOM选择，数组排序， 遍历，　去重，　字符串处理，　类型转换，　正则表达式，　日期处理, 拷贝, 相等问题
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
