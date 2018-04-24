---
title: nginx
date: 2018-03-19 16:11:18
categories: server
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
tags:
  - server
  - nginx
---
ngnix 使用与配置
<!-- more-->

- nginx.conf中三大主模块　event, http, mail：
 低配版http server 配置，配置信息可以写入nginx.conf中http模块中，也可以写在外部文件，在http中引入,
 一般安装后都会有一个default配置
```
# ubuntu, yii , nginx 配置
server {
# 全局配置
        #监听端口
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
　　　　＃项目更目录
        root /home/t04759/workspace/yii-demo/advanced/frontend/web;
        ＃首页文件
        index index.html index.htm index.php;

        # Make site accessible from http://localhost/
        ＃　域名设置
        server_name localhost;
# 项目各级别目录配置
　　　　＃　／ 表示根目录　配置
        location / {
                root  /home/t04759/workspace/yii-demo/advanced/frontend/web;
                index  index.html index.htm index.php;
                try_files $uri $uri/ =404;
                if (!-e $request_filename) {
                   rewrite  ^(.*)$  /index.php?s=$1  last;
                   break;
                }
        }
　＃php解析配置
        location ~ \.php$ {
　　　　    #指定php的根目录
                 root /home/t04759/workspace/yii-demo/advanced/frontend/web;
        　　＃php5-fpm进行管理模块　默认9000端口，最好还是使用源文件地址
                  fastcgi_pass unix:/var/run/php5-fpm.sock;
                  #fastcgi_pass 127.0.0.1:9000;
            ＃入口文件
                  fastcgi_index index.php;
                  fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                  include fastcgi_params;
        }
}
```
- 存放位置
> nginx安装后，应用程序一般存放在/usr/sbin/nginx 或者　/usr/local/sbin/nginx
> nginx.conf 一般存放在/usr/local/nginx/conf/nginx.conf 或者/etc/nginx/

- 配置文件修改后启动
例子
```
sudo /usr/sbin/nginx -t -c /usr/nginx/nginx.conf　//检查配置文件是否正确

sudo service nginx  restart|reload  //重启
sudo service php5-fpm restart|reload　//重启
```
