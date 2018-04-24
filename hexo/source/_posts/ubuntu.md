---
title: ubuntu
date: 2018-02-08 13:32:49
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
thumbnailImage: http://fuersite.coding.me/images/ubuntu.png
categories: os
tags:
  - ubuntu
---
ubuntu 常用操作
<!--more-->

- 进入到系统根目录
> $ cd ／

- 进入到当前用户根目录
> $ cd ~

- 返回上一次所在目录
> $ cd -

- 用户管理
> useradd -d /home/ivin -m ivin //创建新用户，并生成用户目录
> passwd ivin //设置用户登录密码

- 创建全局环境变量

1. 方法一：修改用户目录下的 .bashrc 文件， `$PATH` 表示原有全局变量
例如：
```
vim ~/.bashrc  //打开
export PATH=$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH　//　设置
source ~/.bashrc　//　立即生效
```
2. 方法二：修改系统的 etc 目录下，有一个 profile 文件
例如：　
```
vim /etc/profile
export PATH=$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH　//　设置
source　/etc/profile　//　立即生效
```

3. 方法三：　修改系统目录下的 environment 文件
例如：　
```
vim /etc/environment
找到以下的 PATH 变量：
PATH="<......>"
修改该 PATH 变量，在其中加入自己的path即可，例如：
PATH="~/mypath/bin:<......>"
source /etc/environment　//　立即生效
```

4. 方法四：　直接在shell下用export命令修改，设置临时全局变量
```
export PATH=/opt/android-studio/bin:$PATH
```



-  文件管理
> ls -a //查看全部文件（包含隐性文件）
> ls -l //　查看文件详细信息
> mkdir folderName //创建一个目录
> rmdir emptyFolderName //删除一个空目录
> rm file1 file2 //删除一个文件或多个文件
> rm -rf folderName //删除一个非空目录下的一切
> sudo find ./ -name 'Music'　//　查找目录，　文件
> mv path/name  /path //移动文件
> mv filename newFileName //当前目录下更名

- 文件权限设置
> 形式一： sudo chmod [-cfvR] [ugoa][-+=][rwx] file //-Ｒ表示递归遍历子目录
u 代表所有者（user）
g 代表所有者所在的组群（group）
o 代表其他人，但不是u和g （other）
a 代表全部的人，也就是包括u，g和o
sudo chmod u +r file //所有者可读
> 形式二：　sudo chmod　[-cfvR] rwxrwxrwx (三组rwx　分别对应所以者，组用户，其他人的读写权限)
sudo chmod 600 ××× （只有所有者有读和写的权限）
sudo chmod 644 ××× （所有者有读和写的权限，组用户只有读的权限）
sudo chmod 700 ××× （只有所有者有读和写以及执行的权限）
sudo chmod 666 ××× （每个人都有读和写的权限）
sudo chmod 777 ××× （每个人都有读和写以及执行的权限）

- shell 脚本编写
```bash
//新建文件 test.sh, 内容如下：
#!/bin/bash
echo "hello world"
// 执行脚本
$ chmod +x ./test.sh  //赋予执行权限
$ ./test.sh  //执行
或者直接用解释器执行
/bin/bash test.sh
```

- 软连接
> ln -s 源地址  目的地址

- 进程
> ps -ef | grep grunt //查看grunt 进程信息
> lsof -i:4000 //查看4000端口被哪个进程占据
> kill -9 PID //杀死进程
> fs.inotify.max_user_watches默认值太小，导致too many open files，特别是一下watch操作
> sudo sysctl fs.inotify.max_user_watches=524288 //更改值

- 软件安装
> solfware--------------------------------
安装软件应用 ： sudo apt-get install application
    安装deb包： sudo dpkg -i iptux.deb#安装iptux.deb软件包（其中-i等价于--install）
     系统升级： sudo apt-get dist-update
 更新包管理器列表：  sudo apt-get update
     更新软件： sudo apt-get upgrade
     删除软件： sudo apt-get remove
 sudo apt-get --purge remove <programname>purge表示彻底删除
清理旧版本的软件缓存：sudo apt-get autoclean
清理所有软件缓存：sudo apt-get clean
Ubuntu apt-get下载的安装包路径： /var/cache/apt/archives
已安装的软件包的安装包也删除掉： apt-get clean
/usr ： /usr/local 这个目录包含管理员自己安装的程序；
        /usr/share 包含文件的帮助文件；
        /usr/bin 和/usr/sbin 包含了所有的命令。
/var ： 存放一些服务的安装目录和核心文件，如php apache rpm redis ,日志文件，邮件

- Netstat检查各端口的网络连接 (netstat --help 查看命名)
> -a或–all 显示所有连线中的Socket。

- 常用查看应用进程, 端口命令
> sudo netstat -ap | grep 8080  //查看端口被占用
> netstat -anop  | grep php5-fpm //可查看应用程序状态
> 或者
> lsof -i:8888     //查看端口被占用
> 查看当前应用进程:(显示pid)
> sudo ps -ef | grep nginx
> 杀死进程:
> sudo pkill -9 nginx //杀死全部相关进程
> sudo kill -9 PID // 杀死指定端口号

- 服务启动,暂停
> sudo service nginx start|restart|reload|stop


- 关机重启
>  sudo shutdown -r now //立刻重启
>  sudo shutdown -r 20:00 //20:00重启
>  sudo shutdown -h now // 立刻关机
>  sudo shutdown -h 10  // 10分钟后关机
>  sudo shutdown -c 　　// 取消关机

- 网卡
>  ifconfig  // 查看网卡, IP
   ifdown eth0 //关闭网卡
   ifup eth0 //开启网卡
   sudo /etc/init.d/networking restart //重启网卡

- 压缩／解压
>   解压/压缩
    .tar ---------------------------------------------
    解包：tar xvf FileName.tar
    打包：tar cvf FileName.tar DirName
    .gz ---------------------------------------------
    解压1：gunzip FileName.gz
    解压2：gzip -d FileName.gz
    压缩：gzip FileName
    .tar.gz 和 .tgz---------------------------------------------
    解压：tar zxvf FileName.tar.gz
    压缩：tar zcvf FileName.tar.gz DirName
    .bz2 ------------------------------------------------
    解压1：bzip2 -d FileName.bz2
    解压2：bunzip2 FileName.bz2
    压缩： bzip2 -z FileName
    .tar.bz2---------------------------------------------
    解压：tar jxvf FileName.tar.bz2
    压缩：tar jcvf FileName.tar.bz2 DirName
    .bz---------------------------------------------
    解压1：bzip2 -d FileName.bz
    解压2：bunzip2 FileName.bz
    压缩：未知
    .tar.bz---------------------------------------------
    解压：tar jxvf FileName.tar.bz
    压缩：未知
    .Z---------------------------------------------
    解压：uncompress FileName.Z
    压缩：compress FileName
    .tar.Z---------------------------------------------
    解压：tar Zxvf FileName.tar.Z
    压缩：tar Zcvf FileName.tar.Z DirName
    .zip---------------------------------------------
    解压：unzip FileName.zip
    压缩：zip FileName.zip DirName
    .rar---------------------------------------------
    解压：rar x FileName.rar
    压缩：rar a FileName.rar DirName
