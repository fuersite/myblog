# myblog

Welcome to my post, If you get any problems when you reading, you can leave your comments

## Quick Start

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

### clean static files

``` bash
$ hexo clean
```
### add search index
```
hexo algolia
```

### upload demo
```
hexo deploy
```

### theme user doc

[tranquilpeak user doc](https://github.com/LouisBarranqueiro/hexo-theme-tranquilpeak/blob/master/docs/user.md)
[tranquilpeak user doc](https://github.com/LouisBarranqueiro/hexo-theme-tranquilpeak/blob/master/DOCUMENTATION.md)
### more command you can see package.json



### 评论系统接入 gitment

step1：

```
npm i -D gitment
```
step2:

```
提取node_modules/gitment/gitment.js 或者gitment.browser.js 在hexo项目中引入
```
step3: 插件中默认的评论服务器域名https://gh-oauth.imsun.net， 如果自己搭建了评论系统可以替换掉。

注意：https://gh-oauth.imsun.net 可能会被浏览器认为不安全，导致授权登录失败，需要浏览器运行即可。