---
title: vue架构
date: 2018-08-12 21:46:44
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
thumbnailImage: http://fuersite.coding.me/images/vue.png
categories: os
tags:
  - javascript
  - vue 
---

vue 登录权限，项目架构，代码规范，网络安全
<!-- more -->

### 登录

##### 1. 再次进入免登录
一、 为了方便用户使用，有时候我们会设置免登陆功能，即是在用户登录过一次之后在有效期之内都可以不需要重新登录，直接进入应用。实现方式：在用户登录之后获取到用户一些基本信息，这时候我们可以存放一些基本用户信息或者token之类的数据到cookie当中并且设置有效期。并在路由监听是否已经登录过,获取cookie中的用户信息，如果过期或者不存在则重新登录， 每次登出时记得清掉cookie

            vueRouter.beforeEach((to, from, next) => {
              const userInfo = user.getUserInfo()
              if (!userInfo && to.path != '/login') {
                vueRouter.replace('/login')
              }
              
              if (to.path === '/login') {
                Cookie.clearUserInfo()
                next()
              }
              else {
                next()
              }
              })

二、服务端登录，持续登录
要想更好的做登录还需要了解后端是如果做登录， 登录的方式有账号密码登录，还有第三方登录，当用户登录匹配成功之后服务器返回唯一性的sessionId和accessToken一般会存放到cookie当中，用户访问其他接口时会携带sessionId跟accessToken给服务端，服务端会判断当前用户是否登录或者accessToken是否过期，过期则需要重新登录。这是一个大概的流程，下面我们了解一个一些知识点。

1) sessionId 跟accessToken是什么时候生成的？
用户首次登录时候，会对用户登录账户密码进行校验，校验成功后，服务端给用户生成一个唯一的sessionId跟accessToken，如何生成不重要，重要的是给用户一个唯一的标识，sessionId存放到服务端的session当中,token存放到数据库中，最后在把sessionId和accessToken存到cookie当中。

2）session是什么？
session是服务端用来存放用户数据的类hashTable的结构

3）为什么最后还要把sessionId和accessToken存放到cookie当中？
用户登录后，服务端往cookie中存放sessionId和accessToken，等到用户调用其他接口是会携带回来，这时候服务端会从cookie当中拿出来判断是哪个用户，是否过期。如果没有则让用户登录。

4）有了sessionId为什么还要accessToken?
sessionId主要目的是用来判断用户登录状态，生成sessionId和accessToken时候会设置有效期，当sessionId过期时就可以用accessToken校验用户信息。当用户关闭浏览器之后sessionId就不在浏览器的cookie当中了，这时候访问服务端是服务器拿不到sessionId这就可以使用accessToken校验，并且生成信息sessionId.

5) 关掉浏览器之后session会过期吗？
其实关掉浏览器跟session过期没有什么关系。前面所说的关掉浏览器，找不到session是因为sessionId存的cookie叫做会话cookie（没有设置过期时间，浏览器关闭即销毁）。

6）accessToken会过期吗？
一般我们会设置过期时间，到期后重新登录，生成新的accessToken,我们一般会设置的accessToken过期时间比sessionId长。


三、回到之前的前端免登录
在我们了解了后端登录流程之后，我们是不是要考虑一个问题，那就是用户sessionId或者accessToKen过期之后我们怎么重登录呢？
这时候就需要我们监听ajax请求返回的code，服务端会指定code，我们拿到code(例如 401)值后就需要让用户重新登录。

例如:我这里使用的是axios

          axios.interceptors.response.use(
            response => {
              if(response.data.code == 401) {
                router.push({
                  path: '/login',
                  query: {redirect: router.currentRoute.fullPath}
                })
              }
              return Promise.resolve(response);
            },
            error => {
              return Promise.reject(error)
            });

#####  2. 用户登录权限控制
关于权限的控制有很多种方式，但是这需要根据实际的业务需求，但是对于前端而言，权限就无非两种，
一种是路由权限，一种是操作权限。 而对于后端而言则是角色权限和特殊操作权限，这里解释一下操作权限。

- 操作权限： 是指用户需要满足某些条件，或者完成某些操作之后才能进行下一步操作的权限。

1) 那么前端的路由权限应该如何去做呢？ 首先路由权限包括了菜单权限，我们知道有的应用的权限是根据角色来划分的，不同角色有这不同菜单权限和一些增删改查页面的路由权限，下面我们介绍几种常用方法。

第一种 在路由的 meta 信息中添加 权限的信息，怎么添加呢 这个看实际情况。

比如以角色为导向 , 在路由里面表明什么角色可以访问，然后在监听路由进行权限判断
```
{ path: '', name: 'home', component: () => import('../views/index/home.vue'), meta: {author:['admin', 'staff']}}
```
也可以使用权限列表，用户登录之后会返回当前用户的权限列表。进行路由监听，判断该路由权限是否在用户权限列表当中。
```
{ path: '', name: '员工管理', component: () => import('../views/index/home.vue'), meta: {authority:'staffManage'}}}
```
在vue 2.0之后还可以使用动态路由来控制权限，就是更加用户的权限列表去生成路由，而不是预先生成路由，使用addRoutes时需要在vue的实例中使用，很多网上直接在路由监听处进行动态生成，然并软。。。。
```
export default {
  name: 'app',
  created () {
    const routes = user.generateDynamicRouter()
    this.$router.addRoutes(routes)
  },
  data () {
    return {
      showModal: false
    }
  }
}
</script>
```

2) 对于特殊的操作权限我们应该如何应对呢？
两种方式：
第一种：判断用户是否有该操作权限，如果没有则显示没有操作权限，或者没有操作的按钮之类的。这个是在前端进行判断的。
第二种：对api进行权限校验，后端进行校验，如果没有权限则返回相应的code，前端对应相应code作出提示。

### 项目架构

1. 配置文件
  config.js: 一些配置文件比如HOST, 图片上传地址等。

2. 公共组件
  conponents： 存放一些公用组件，组件分为业务组件和非业务组件。

3. 初始化挂载文件
  init.js: 初始化挂载一些组件，遍历挂载。
```
const components = { breadCrumb, modal, DatePicker, MenuItem, Menu, Submenu, Icon, MenuGroup, subItemTitle, subTitle, Table, Page, Steps, Step, Modal, RadioGroup, Radio }

const install = function (Vue) {
    Vue.prototype.$Cookie = Cookie;
    Vue.prototype.$Session = Session;
    Vue.prototype.$Message = Message;
    Vue.prototype.$md5 = md5;
    for ( let key in components) {
        Vue.component(key, components[key])
    }
}

export default { install }
```

4. axios http请求封装，监听 (new promise)
```
import axios from 'axios'
import router from '../router'

axios.defaults.timeout = 5000; 
 
axios.interceptors.response.use(
  response => {
    if (response.data.code !=null && response.data.code !=undefined) {
      if(response.data.code == 401) {
        vm.$Message.warning('请重新登录');
        router.push({
          path: '/login',
          query: {redirect: router.currentRoute.fullPath}
        })
        return
      }

      return Promise.resolve(response);
    }
    return Promise.resolve(response);
  },
  error => {
    return Promise.reject(error.response);
  });

export { axios }

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
    .then(response => {
      console.log('response',response)
      resolve(response.data.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}

export function del(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      params: params
    })
    .then(response => {
      console.log('response',response)
      resolve(response.data.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    let config = {
      headers:{'Content-Type':'application/json;charset=UTF-8'}
    };

    axios.post(url, data, config)
      .then(response => {
        console.log('response',response)
        resolve(response.data.data);
      }, err => {
        reject(err);
      })
  })
}
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data.data);
      }, err => {
        reject(err);
      })
  })
}

export default { get, post, del, put }
```

5. 跨组件通信 bus
bus.js
```
import Vue from 'vue'

const bus = new Vue();

export default bus;
```

使用
```
import Bus from './bus'
Bus.$emit('message', {newMsgCount: data})

Bus.$on('message', (data)=>{
                
})
```

5. cookie sessionStorage封装

Cookie
```
export default class Cookie {
    static EXPIRED_DAYS = 30;
    static getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
          return (unescape(arr[2]));
        else
          return null;
    }
       
    static setCookie (name, value, expiredays = null) {
        var exdate = new Date();
        expiredays = expiredays || Cookie.EXPIRED_DAYS 
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = name + "=" + escape(value) + ";expires=" + exdate.toGMTString()
    };
       
    static delCookie (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var value = Cookie.getCookie(name);
        if (value != null) 
            document.cookie = name + "=" + value + ";expires=" + exp.toGMTString()
    }
}

```

Session 
```
export function setSessionStorage (key, value) {
  if (typeof value == 'object')
    value =  JSON.stringify(value)
  sessionStorage.setItem(key, value)
}

export function getSessionStorage (key) {
  return JSON.parse(sessionStorage.getItem(key))
}

export function clearSessionStorage () {
  sessionStorage.clear()
}

export function setLocalStorage (key, value) {
  if (typeof value == 'object')
    value =  JSON.stringify(value)
  localStorage.setItem(key, value)
}

export function getLocalStorage (key) {
  return JSON.parse(localStorage.getItem(key))
}

export function clearLocalStorage () {
  localStorage.clear()
}

export default {
  setSessionStorage,
  getSessionStorage,
  clearSessionStorage,
  setLocalStorage,
  getLocalStorage,
  clearLocalStorage
}

```


### IE 兼容
由于IE低版本 不支持一些ES6语法（Promise let 等）或其他第三方库（axios）

解决方案

index.html 
```
// 告诉浏览器 IE 使用最高版本
<meta http-equiv="X-UA-Compatible" content="IE=edge">
```
npm install -i -D babel-polyfill

```
// 在main.js 顶部引入

import 'babel-polyfill'

或

// 在 webpack.base.conf.js

  entry: {
    app:['babel-polyfill','./src/main.js']
  }
```

对于一些 其他UI库 可能需要其他处理 例如 iview

  {
      test: /node_module/iview/src/.vue?/,
      loader: 'babel-loader',
  }
