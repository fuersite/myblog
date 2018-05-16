---
title: jsEventPriority
date: 2018-04-24 17:21:33
categories: javascript
tags:
  - javascript
  - 事件
  - onblurｌ
---

JS Onblur 与Onclick事件冲突的解决办法
<!-- more -->

#### 示例：
1. 存在一个input框，onfoucs 时出现一个下拉框列表，点击选择其中一项时，显示在input框， input框onblur，onblur事件关闭下拉框。

#### 存在的问题：
1. 如果点击选择的事件使用的是onclick()时，onblur会优先onclick执行，导致下拉框消失，而没有选中。

#### 解决方法：
1. 使用onmousedown()代替onclick(), onmousedown优先于onblur()。
2. 在onblur(){ settimeout(function{ 下拉框消失 }, 50)}，在onblur中添加定时器进行延迟。

