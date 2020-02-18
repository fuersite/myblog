---
title: web端响应式及其自适应
date: 2019-09-21 08:33:10
categories: javascript
tags:
  - web
---

pc端响应式及其自适应

<!-- more -->

## 概念

响应式-指根据不同屏幕尺寸，做出样式、布局的调整，使得无论pc端，还是移动端界面有好。

自适应-更多的是使用一些百分比，rem，vh vw等自动根据屏幕宽度变化而变化。

### web端实现响应式及自适应布局的实现方案

1. 媒体查询：媒体查询要先明确好是移动端优先还是pc端优先。

2. 百分比布局：可以将百分比和max(min)一起结合使用。

3. rem布局：rem是根据根元素的font-size决定的，且需要更加不同分辨率做出改变，还要移动端开发要注意1物理像素的问题

4. vw、vh视口单位的使用

5. flex 弹性布局、grid网格布局、Columns栅格系统

6. 图片适配：使用max-width:100% 自适应缩放，srcset 根据不同dpi加载不同分辨率图片，background-image使用，需要宽高比的图，应该用padding-top实现

7. 一些UI框架的使用例如：bootstrap、 element-ui(vue)、ant-design-pro(react)、amazeui