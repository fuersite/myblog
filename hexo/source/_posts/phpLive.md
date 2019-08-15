---
title: php生命周期
date: 2018-04-24 17:24:10
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
thumbnailImage: http://fuersite.coding.me/images/php.png
categories: javascript
tags:
  - php
  - php 生命周期
---

学习框架先从生命周期开始
<!-- more -->

### 首先我们看一份生命周期图
![live](http://fuersite.coding.me/images/phplive.png)

### Yii启动请求流程

1. 入口脚本加载主体配置(index.php)
--- 项目启动执行入口文件, 加载config数组, 实例化Application

          ```
          <?php

          defined('YII_DEBUG') or define('YII_DEBUG', true);
          defined('YII_ENV') or define('YII_ENV', 'dev');

          require __DIR__ . '/../vendor/autoload.php';
          require __DIR__ . '/../vendor/yiisoft/yii2/Yii.php';

          $config = require __DIR__ . '/../config/web.php';

          (new yii\web\Application($config))->run();

          ```

2. 入口脚本new Application() 执行构造函数
--- yii\web\Application 继承yii\base\Application, 执行父类构造函数

        ```
            public function __construct($config = [])
            {
                Yii::$app = $this;
                static::setInstance($this);

                $this->state = self::STATE_BEGIN;

                $this->preInit($config);

                $this->registerErrorHandler($config);

                Component::__construct($config);
            }

        ```
  - static::setInstance($this); 加载当前模块app
  - $this->preInit($config); 会设置一下基本配置 例如basePath, vendorPath, runtimePath, 设置container(依赖)设置核心组件coreComponent.
  - $this->registerErrorHandler($config); 注册错误处理组件, 但是核心组件是yii默认开启的,没有在config中配置,也同样起作用
  - Component::__construct($config); 组件实例化 执行Yii::configure($this, $config)

          ``` // component.php
              public function __construct($config = [])
              {
                  if (!empty($config)) {
                      Yii::configure($this, $config);
                  }
                  $this->init();
              }
              // BaseObject.php
              public static function configure($object, $properties)
              {
                  foreach ($properties as $name => $value) {
                      $object->$name = $value;
                  }

                  return $object;
              }
          ```
  - 执行Application::init(), 初始化，该函数会调用 yii\base\Application::bootstrap()

3. 入口脚本执行run()方法, 运行主体
  * 触发 [[yii\base\Application::EVENT_BEFORE_REQUEST|EVENT_BEFORE_REQUEST]] 事件。
  * 处理请求：解析请求 路由 和相关参数；创建路由指定的模块、控制器和动作对应的类，并运行动作。
  * 触发 [[yii\base\Application::EVENT_AFTER_REQUEST|EVENT_AFTER_REQUEST]] 事件。
  * 发送响应到终端用户.

4. 入口脚本接收应用主体传来的退出状态($response->exitStatus)并完成请求的处理。
