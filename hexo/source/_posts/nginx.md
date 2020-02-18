---
title: nginx
date: 2018-03-19 16:11:18
categories: server
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
tags:
  - server
  - 服务端
  - nginx
---
ngnix 使用与配置
<!-- more-->

## nginx.conf中三大主模块　event, http, mail：
 低配版http server 配置，配置信息可以写入nginx.conf中http模块中，也可以写在外部文件，在http中引入,
 一般安装后都会有一个default配置

## 配置示例

```
########### 每个指令必须有分号结束。#################
#user administrator administrators;  #配置用户或者组，默认为nobody nobody。
#worker_processes 2;  #允许生成的进程数，默认为1
#pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址
error_log log/error.log debug;  #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
events {
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    #最大连接数，默认为512
}
http {
    include       mime.types;   #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
    #access_log off; #取消服务日志    
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
    access_log log/access.log myFormat;  #combined为日志格式的默认值
    sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。

    upstream mysvr {   
      server 127.0.0.1:7878;
      server 192.168.10.121:3333 backup;  #热备
    }
    error_page 404 https://www.baidu.com; #错误页
    server {
        keepalive_requests 120; #单连接请求上限次数。
        listen       4545;   #监听端口
        server_name  127.0.0.1;   #监听地址       
        location  ~*^.+$ {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           #root path;  #根目录
           #index vv.txt;  #设置默认页
           proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
           deny 127.0.0.1;  #拒绝的ip
           allow 172.18.5.54; #允许的ip           
        } 
    }
}
```
1. $remote_addr 与 $http_x_forwarded_for 用以记录客户端的ip地址；
2. $remote_user ：用来记录客户端用户名称；
3. $time_local ： 用来记录访问时间与时区；
4. $request ： 用来记录请求的url与http协议；
5. $status ： 用来记录请求状态；成功是200；
6. $body_bytes_s ent ：记录发送给客户端文件主体内容大小；
7. $http_referer ：用来记录从那个页面链接访问过来的；
8. $http_user_agent ：记录客户端浏览器的相关信息；

- 存放位置
nginx安装后，应用程序一般存放在/usr/sbin/nginx 或者　/usr/local/sbin/nginx
nginx.conf 一般存放在/usr/local/nginx/conf/nginx.conf 或者/etc/nginx/

- 配置文件修改后启动
例子
```
sudo /usr/sbin/nginx -t -c /usr/nginx/nginx.conf　//检查配置文件是否正确

sudo service nginx  restart|reload  //重启nginx
或
systemctl restart nginx 

sudo service php5-fpm restart|reload　//重启 php管理进程
```

## location 匹配

### location语法规则： location [=|~|~*|^~] /uri/ { … }

= 开头表示精确匹配
^~ 开头表示uri以某个常规字符串开头，理解为匹配 url路径即可
~ 表示区分大小写的正则匹配
~* 表示不区分大小写的正则匹配
!~和!~* 分别为区分大小写不匹配及不区分大小写不匹配 的正则
/ 通用匹配，任何请求都会匹配到。

如果匹配规则以^开头，就是匹配以指定字符串开头的路径，如果没有就是匹配url中的内容是否包含指定字符串
如果匹配规则以$结尾，就是匹配以指定字符串结尾的路径
多个location配置的情况下匹配顺序为（当有匹配成功时候，停止匹配，按当前匹配规则处理请求）：

1. 优先匹配 =
2. 其次匹配 ^~
3. 按照文件中的匹配顺序执行
4. 最后匹配 /

1、必选规则

```
location / {
    root /services/apps/front/;
}
```

2、匹配静态资源

```
location ^~ /static/ {
    root /services/apps/front/static;
}
location ~* \.(gif|jpg|jpeg|png|css|js|ico)$ {
    root /webroot/res/;
}
```

3、防盗链

```
location ~* \.(gif|jpg|swf)$ {
    valid_referers none blocked jouypub.com files.jouypub.com;
    if ($invalid_referer) {
        rewrite ^/ http://$host/logo.png;
    }
}
jouypub.com、files.jouypub.com是运行出现的白名单
```

4、根据文件类型设置过期时间

```
location ~* \.(js|css|jpg|jpeg|gif|png|swf)$ {
    if (-f $request_filename) {
        expires 1h;
        break;
    }
}
```

5、禁止访问某个目录

```
location ~* \.(txt|doc)${
    root /services/apps/front/doc;
    deny all;
}
```

6. location中的/结尾和非/结尾

```
location ^~ /api {
    proxy_pass http://localhost:8000;
}
location ^~ /api {
    proxy_pass http://localhost:8000/;
}
访问路径http://www.jouypub.com/api/a.html，
规则1会被转发到：http://localhost:8000/api/a.html
规则2会被转发到：http://localhost:8000/a.html
```

7. try_files指令说明

其作用是按顺序检查文件是否存在，返回第一个找到的文件或文件夹(结尾加斜线表示为文件夹)，如果所有的文件或文件夹都找不到，会进行一个内部重定向到最后一个参数。

```
location /takeout {
        root /root/web/
        try_files /app/cache/ $uri @fallback; 
        index index.php index.html;
}

它将检测/root/web/app/cache//indx.php,root/web/app/cache/index.html 和 /root/web/$uri是否存在，如果不存在着内部重定向到@fallback(＠表示配置文件中预定义标记点) 。
```

例如 

```
location ~.*\.(gif|jpg|jpeg|png)$ {
        root /web/wwwroot;
        try_files /static/$uri $uri 404 ;
}
```
$uri = /test.jpg
http://example.com/test.jpg时先去检查/web/wwwroot/static/test.jpg是否存在，不存在就取/web/wwwroot/test.jpg，如果第二个也不存在就返回404