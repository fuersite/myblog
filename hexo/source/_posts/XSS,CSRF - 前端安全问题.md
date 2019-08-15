---
title: XSS,CSRF-前端安全
date: 2018-11-25 10:26:08
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
thumbnailImage: http://fuersite.coding.me/images/hack.jpg
tags:
  - 前端安全
  - CSRF
  - XSS
---

XSS,CSRF前端安全问题讲解
<!-- more -->

## XSS定义
XSS, （Cross Site Scripting）, 中文名为跨站脚本, 本质上是在页面上嵌入恶意代码，实施攻击。

### XSS攻击方式

- 反射型攻击，在http请求，或者一些图片链接，link的url中嵌入恶意代码，提交给服务器，服务器再返回给前端页面当中，实现攻击行为。

- 存储型攻击, 跟反射型攻击方式相同，不过它是把恶意代码保存到服务器的数据库或者文件系统当中，之后如果用户操作，比如一些查询，就会把恶意代码查询出来，如果前端没有过滤转换很可能就会执行恶意代码， 或者攻击者可以通过这种方式获取用户cookie保存到自己服务器。

- DOM XSS, DOM XSS攻击不需要服务器端的解析响应的直接参与，而是通过浏览器端的DOM解析。这完全是客户端的事情。比如 eval 能把字符串转为js执行语句。


### XSS预防
- 对cookie的保护
    1. 对重要的cookie设置httpOnly, 防止客户端通过document.cookie读取cookie。服务端可以设置此字段。
- 对用户输入数据的处理
    1. 编码：不能对用户输入的内容都保持原样，对用户输入的数据进行字符实体编码。
    2. 解码：原样显示内容的时候必须解码.
    3. 过滤：把输入的一些不合法的东西都过滤掉，从而保证安全性。如移除用户上传的DOM属性，如onerror，移除用户上传的Style节点，iframe, script节点等。

## CSRF定义
CSRF,(Cross-site request forgery)跨站点请求伪造，因为http请求是一种无状态的，服务端会使用session保存用户登录状态及一些校验信息。而前端一般都会使用cookie存放一些session信息每次http请求都会携带过去作为校验。CSRF就是利用这一点，把cookie信息拿过去，发送http请求达到入侵功能。

例如：
1. 用户登录A网站，并生成cookie信息。
2. 用户在没有登出A网站情况，打开恶意网站B。如果网站B有一个操作是向A网站服务器发送http请求的，这时候cookie信息也会携带过去成功访问。

### CSRF 攻击网站
- 在用户登录A网站前提下，B网站访问 A网站接口，获取信息，或者插入恶意信息。

### CSRF预防
- 通过 referer(有效,不一定可靠，可以为空，也可以伪造)、token(足够随机性，放到表单设置hiden中提交或者放到headers中提交给服务端校验) 或者 验证码（有效但是，用户体验不好） 来检测用户提交。
- 尽量不要在页面的链接中暴露用户隐私信息。
- 对于用户修改删除等操作最好都使用post 操作。
- 避免全站通用的cookie，严格设置cookie的域。
      
参考

> https://www.cnblogs.com/shytong/p/5308667.html
> https://www.cnblogs.com/unclekeith/p/7750681.html