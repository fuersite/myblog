---
title: git 安装与使用
date: 2018-02-03 12:45:03
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
thumbnailImage: http://fuersite.coding.me/images/git.png
categories: devTool
tags:
  - git
---
Git 安装与使用
<!-- more -->

#### ubuntu下安装
- 命令行模式安装
``` bash
$ sudo apt-get install git
```
- 用户名，邮箱配置
``` bash
$ git config --global user.name "github用户名"
$ git config --global user.email "github绑定邮箱地址"
```
- 创建验证用的公钥
``` bash
$ ssh-keygen -C 'you email address@gmail.com' -t rsa
```
- 上传公钥到github，找到ssh key 添加公钥
``` bash
$ cd ~/.ssh
$ cat id_rsa.pub //查看公钥，　复制添加到github上
```
#### windows下安装
- 下载地址：https://git-scm.com/download/win
- 点击安装, continue next
-  在Adjusting your PATH environment选项中, 选中Use Git from the Windows Command Prompt，　把git命令添加到系统环境变量中，可以在任何地方使用git命令
-  打开命令窗口或者打开Git Bash使用git命令

``` bash
git config --global user.name “用户名” //配置用户名，邮箱　同上
git config --global user.email “邮箱”
ssh-keygen –C "邮箱地址"　–t rsa  //生成公钥，生成后复制id_rsa.pub　添加到github ssh key

```

<font color="#7d1c1c" size=4> you can use git command happily after install it</font>

#### Git 使用小妙招,专治各种误操作

Git 流程图

![git-process-graph](http://fuersite.coding.me/images/gitProcess.png)

- 本地创建仓库发布的远程仓库
``` bash
$ mkdir myRepository
$ cd myRepository
$ git init //到这一步仓库已经初始化了，可以往里面添加内容
$ git add . // 把添加内容添加到　暂存区stage
$ git commit -m "" //生成commit记录，　把暂存区内容提交到本地仓库index
$ git push origin master //push到远程master分支，　可以去github上查看了
```
- 拉取远程repository到本地
```
$ git clone https://github.com/xxxx/xxxx.git
```
- 在本地切一个新分支
``` bash
$ git checkout -b newbranchName //是git branch 跟git checkout 合操作
```
- 从远程切一个分支到本地来创建本地分支
``` bash
$ git checkout -b localBranchName origin/branchName
```
- 使用commitId 来创建一个分支
``` bash
git branch branchName commitId / git  checkout -b branchName commitId
```
- 查看分支
``` bash
$ git branch  //查看本地分支列表
$ git branch -a //查看远程分支列表
```
- 切换分支
``` bash
$ git checkout branchName
```
- 删除分支
``` bash
$ git branch -D <BranchName> //删除本地分支
$ git push origin --delete <BranchName> //删除远程分支
```
- 重命名分支
``` bash
$ git branch -m <oldBranchName> <newBranchName>
```
- <font size= 4 color=#A52A2A>`reset, checkout`</font>  回退

1. `git reset HEAD | git reset`
可以用于暂存区（index/stage）回退到工作区，撤销add 的修改过
2. ` git reset commitId`
用于回退到指定版本(commitId), 用于仓库修改回退到工作区，撤销commit的修改
3. `git checkout fileName`
用于撤销工作区文件的修改，这两个可以配合使用，但是不能删除新建文件．
4. `git reset HEAD^`
用于版本回退，撤销一个commit,修改过内容回退到工作区（默认　--sort），参数--sort 不删除修改过，--ｈard 会删除修改过
5. `git reset HEAD~n`
表示回退到之前的几个版本


- --amend作用
``` bash
$ git commit --amend //用来修改上次提交信息，并且把本次提交跟上次合并
```
- 本地修改提交到别人的commit上，解决办法
``` bash
方法一：修改提交的用户名（不推荐）
$ git commit --amend --author='Your Name<email> '
方法二：重新切一个分支，　把那个commit cherry-pick过来
$ git branch newbranch origin/develop //切新分支
$ git log　//查看commit，并且复制commitId
$ git checkout newbranch //切到新分支
$ git cherry-pick commitId //把复制的commitId Pick过来，　这时候本地多了一个commit
$ git reset HEAD^ //会退到上一个commit ，但是修改还在，这时候只需保留自己的修改，别人的修改丢弃
```
- rebase 解决冲突神器
``` bash
准备工作，日常必备：
$ git branch -u origin/remoteBranchName //指定起源远程分支
$ git fetch //拉取远程分支更新
$ git branch -vv　//对比远程分支，　看ahead/behind 几个版本
用rebase 把远程更新应用到本地分支：
$ git rebase origin/remoteBranchName //rebase 后，会显示一些冲突，没有冲突的话就会自动合并，有冲突的话就需要手动解决冲突然后进行下面操作．
$ git add . //添加解决冲突的更改
$ git rebase --continue //继续rebase ，如果还有冲突就重复上面操作，　指导没有冲突．
$git rebase --abort //如果执行rebase 过程中想反悔悔，就执行次操作恢复
```
- reflog 无限轮回
当HEAD发生改变（包括切换branch, pull, rebase, 添加新commit）一个新的纪录就会被添加到reflog, 当你一些误操作
``` bash
$ git reflog //查看
```
![git-reflog](http://fuersite.coding.me/images/reflog.png)

当你误操作导致一些文件丢失时，其他解决方法时，就可以利用这些HEAD或者commitId 进行恢复
``` bash
$ git reset commitId
或者
$ git checkout -b newbranch commitId //重新切一个分支
```
- 合并多个commit
假如你有三个commit: 1,2,3 你要合成一个，如下操作
          commit3 : "3"
          commit2 : "2"
          commit1 : "1"
          commit0 : "other's commit"
1. 执行`$ git rebase -i commit0 `　会显示
          pick commit1 ...
          pick commit2 ...
          pick commit3 ...
2. 修改commit2和commit3的pick 改成fixup,然后保存退出
3. 然后执行 `git add . `, `git rebase --continue`　完成

- 查看git config信息
``` bash
$ vim ~/.gitconfig //可查看配置文件
或者
$ git config --global  --list
```

- reset 、 revert 区别
都是回退修改，reset 直接删除commit及其修改，revert生成一个新的commit来回退删除指定commit修改。 revert时如果有冲突的话
，解决冲突之后 可以 revert --continue , 如果不解决，想撤销回退，可以 revert --abort 
r
例： 已经存在两个commit
  ```bash
  commit2
  commit1
  ```

  git reset HEAD 结果
  ```
  commit1
  ```

  git revert HEAD 结果
  ```
  Revert commit2
  commit2
  commit1
  ```

- 删除本地和远程分支

  ```
  删除本地分支
  git branch -D branchName

  删除本地远程分支
  git branch -r -d origin/branchName

  删除远程分支
  git push origin -d remoteBranchName 
  或
  git push origin :remoteBranchName
  ```

