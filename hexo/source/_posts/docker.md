---
title: docker入门实践
date: 2019-02-18 21:58:17
categories: server
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
tags:
  - docker
---

玩转docker
<!-- more -->

## docker 

#### docker 安装完后启动服务
- 启动 docker
```
sudo systemctl enable docker
sudo systemctl start docker
```
- 启动docker 后台服务
```
sudo service docker start
```
#### docker 分层构建的理解
当我们运行一个容器的时候（如果不使用卷的话），我们做的任何文件修改都会被记录于容器存储层里。就是在原有镜像的基础上，再叠加上容器的存储层，并构成新的镜像。以后我们运行这个新镜像的时候，就会拥有原有容器最后的文件变化。
例如Dockerfile 里面定义两个 RUN 命令，两个RUN命令执行环境不一样。
```
假设 /app 中有world.txt
RUN cd /app
RUN echo "hello" > world.txt
进行构建镜像运行后会发现 /app/world.txt 文件
```
#### 宿主机与容器之间拷贝文件
- 容器拷贝到宿主机
docker cp container_name：/data /data
- 宿主机拷贝到容器
docker cp /data container_name：/data

#### docker build 上下文
`$ docker build -t test .` . 为buid的上下文目录， docker 会从上下文目录寻找Dockerfile文件。 上下文目录可以自定义 例如 `/home/data`

#### WORKDIR <建立工作目录路径>
设置 `WORKDIR /app` 之后一系列操作相对路径就是 /app

#### docker上下文 , WORKDIR, COPY， ADD 路径问题
Dockerfile中 `COPY, ADD [源路径]：[目标路径]` 。
- 源路径是相对于上下文的，image构建时候回把上下文目录内容放置到主机的docker工作区中。所以copy的源文件只能从上下文目录中获取而不是从宿主机其他路径获取。
- 目标路径是相对于容器的工作目录，如果没有指定WORKDIR,那么就相对于根目录。

#### 共享文件
- `Dockerfile`中可以事先定义用来挂载的匿名卷：`VOLUME ["/data", "<路径2>"...]`，dockerfile中不定义也不影响run的时候挂载
- `docker run -d -v $PWD/data:/data`  把宿主机`$PWD/data`文件夹挂载到容器中/data上，可以共享文件。
- 如果以上挂载失败，可以尝试命令 `docker run -d -v $PWD/data:/data --privileged=true`， privileged可以使得容器中的root用户拥有宿主机的root权限。

#### 给容器开放多个端口
- Docckerfile 中可以`EXPOSE EXPOSE <端口1> [<端口2>.]`
```
EXPOSE 8009
EXPOSE 8005
EXPOSE 8443
```
- `docker run -p` <宿主端口>:<容器端口> -p <容器端口>... ，只能指定一个宿主端口映射到容器端口，其他端口宿主机随机映射。

#### 如何给运行中的容器多开放一个端口
- 使用宿主机中的 iptables 服务，由于本人防火墙出现问题，并没有成功。具体操作自行google,百度

#### 使用commit 把容器构建成镜像
容器是镜像的实例，操作过程中会有很多修改，我们如果想要保存这些修改，那就把容器保存为一个镜像。
- `docker commit` [选项] <容器ID或容器名> [<仓库名>[:<标签>]]

```
$ docker commit \
    --author "qq <qq@gmail.com>" \
    --message "修改了默认网页" \
    webserver \
    nginx:v2
```

#### ENTRYPOINT 、CMD 使用
- `ENTRYPOINT 、CMD` 命令都会在应用运行前执行
- 如果Dockerfile 中同时有`ENTRYPOINT 、CMD`，执行时会变成 <ENTRYPOINT> "<CMD>"，拼接在一起。
- 构建事使用命令覆盖Dockerfile中的CMD， `docker run -it ubuntu` 是默认接的CMD命令 `/bin/bash`: 即 `docker run -it ubuntu /bin/bash`，也可以替换其他命令例 `cat /etc/os-release`