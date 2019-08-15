---
title: 'async await promise 理解与使用'
date: 2018-11-06 23:12:56
categories: javascript
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
tags:
  - javascript
  - promise
---
async, await, promise 之间关系
<!-- more -->

#### Promise
- 一个promise的三种状态 pending、resolve、rejected 从字面量应该能够理解他们的意思
- promise 会返回resolve 或者reject
- promise必须实现then方法，then方法可以拿到promise里面返回的内容，不论成功或者失败

#### async 
- 返回一个 promise对象

#### await
- 获取promise对象里面的内容


#### 理解性例子
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <title>ivin</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
                <script>
                    async function async1() {
                        return 'I am promise.resolve 1'
                    }
                    async function async2() {
                        const data = await async1()
                        return data
                    } 

                    async function async3 () {
                        const data = await async2()
                        console.log(data)
                    }

                    async3()

                    function getPromise() {
                        return new Promise((resolve, reject) => {
                            resolve('I am promise.resolve 2')
                        })
                    }

                    async function async4() {
                        const data = await getPromise()
                        console.log(data)
                    }
                    
                    async4()

                    async function rejectPromise1(flag) {
                        if (flag) {
                            return 'I am promise.resolve'
                        } else {
                            throw 'I am promise.reject 1'
                        }
                    }

                    rejectPromise1().then((data)=>{
                        console.log('reject 不会进入我这里', data)
                    }).catch((err)=> {
                        console.log(err)
                    })

                    async function rejectPromise2() {
                        return new Promise((resolve, reject) => {
                            reject('I am promise.reject 2')
                        })
                    }

                    async function async5() {
                        try {
                            const data = await rejectPromise2()
                        } catch (err) {
                            console.log(err)
                        }
                        console.log('如果没有try catch 就不会执行我。。。。。。。 reject 2')
                    }

                    async5()

                    rejectPromise1(false).then((resolve)=> {
                        console.log('--------resolev', resolve)
                    }, (reject)=> {
                        console.log('--------reject', reject)
                    })
                </script>
            </body>
            </html>

执行结果：
```
--------reject I am promise.reject 1
asyn.html:50 I am promise.reject 1
asyn.html:34 I am promise.resolve 2
asyn.html:63 I am promise.reject 2
asyn.html:65 如果没有try catch 就不会执行我。。。。。。。 reject 2
asyn.html:21 I am promise.resolve 1
```