---
title: 前端SEO优化 - 单页面应用SEO优化
date: 2018-10-16 21:43:08
categories: javascript
tags:
  - SEO
  - 前端SEO优化
  - 单页面应用SEO优化
---

爬虫原理，seo优化，单页应用seo优化问题
<!-- more -->

## 爬虫原理
- 什么是爬虫？
  是一种网络机器人，机器人会通过各种途径获取到需要爬取的网站url，暂存url种子库中并在适当时候进行访问你的url`（发送http/https请求）`。如果你网站内容被成功收录，那么说明你的SEO做的很成功

- 爬虫爬取方式
  网络爬虫的爬行策略分为深度优先和广度优先。

  1.  深度优先
    深度优先搜索策略从起始网页开始，选择一个URL进入，分析这个网页中的URL，选择一个再进入。如此一个链接一个链接地抓取下去，直到处理完一条路线之后再处理下一条路线。深度优先策略设计较为简单。然而门户网站提供的链接往往最具价值，PageRank也很高，但每深入一层，网页价值和PageRank都会相应地有所下降。这暗示了重要网页通常距离种子较近，而过度深入抓取到的网页却价值很低。同时，这种策略抓取深度直接影响着抓取命中率以及抓取效率，对抓取深度是该种策略的关键。

  2.  广度优先
    广度优先搜索策略是指在抓取过程中，在完成当前层次的搜索后，才进行下一层次的搜索。该算法的设计和实现相对简单。在目前为覆盖尽可能多的网页，一般使用广度优先搜索方法。也有很多研究将广度优先搜索策略应用于聚焦爬虫中。其基本思想是认为与初始URL在一定链接距离内的网页具有主题相关性的概率很大。另外一种方法是将广度优先搜索与网页过滤技术结合使用，先用广度优先策略抓取网页，再将其中无关的网页过滤掉。这些方法的缺点在于，随着抓取网页的增多，大量的无关网页将被下载并过滤，算法的效率将变低。

## SEO优化基础知识
- 语义化html标签
  1. 语义化标签是指标签本身具有意义，例如： `<title>`标签，能够让人一眼看出此标签用作标题，可阅读性强。
  2. 常使用语义化标签

    ```
      <title>：页面主体内容。
      <hn>：h1~h6，分级标题，<h1> 与 <title> 协调有利于搜索引擎优化。
      <ul>：无序列表。
      <li>：有序列表。
      <header>：页眉通常包括网站标志、主导航、全站链接以及搜索框。
      <nav>：标记导航，仅对文档中重要的链接群使用。
      <main>：页面主要内容，一个页面只能使用一次。如果是web应用，则包围其主要功能。
      <article>：定义外部的内容，其中的内容独立于文档的其余部分。
      <section>：定义文档中的节（section、区段）。比如章节、页眉、页脚或文档中的其他部分。
      <aside>：定义其所处内容之外的内容。如侧栏、文章的一组链接、广告、友情链接、相关产品列表等。
      <footer>：页脚，只有当父级是body时，才是整个页面的页脚。
      <small>：呈现小号字体效果，指定细则，输入免责声明、注解、署名、版权。
      <strong>：和 em 标签一样，用于强调文本，但它强调的程度更强一些。
      <em>：将其中的文本表示为强调的内容，表现为斜体。
      <mark>：使用黄色突出显示部分文本。
      <figure>：规定独立的流内容（图像、图表、照片、代码等等）（默认有40px左右margin）。
      <figcaption>：定义 figure 元素的标题，应该被置于 figure 元素的第一个或最后一个子元素的位置。
      <cite>：表示所包含的文本对某个参考文献的引用，比如书籍或者杂志的标题。
      <blockquoto>：定义块引用，块引用拥有它们自己的空间。
      <q>：短的引述（跨浏览器问题，尽量避免使用）。
      <time>：datetime属性遵循特定格式，如果忽略此属性，文本内容必须是合法的日期或者时间格式。
      <abbr>：简称或缩写。
      <dfn>：定义术语元素，与定义必须紧挨着，可以在描述列表dl元素中使用。
      <address>：作者、相关人士或组织的联系信息（电子邮件地址、指向联系信息页的链接）。
      <del>：移除的内容。
      <ins>：添加的内容。
      <code>：标记代码。
      <meter>：定义已知范围或分数值内的标量测量。（Internet Explorer 不支持 meter 标签）
      <progress>：定义运行中的进度（进程）。

      <>：

      <>：
    ```
- html标签的权重
  1. HTML的不同标签在SEO优化中的权重分数不同
  2. HTML标签权重分值排列
    ```
      内部链接(`<a href=" http://www.yahoo.com">雅虎</a>`)文字：10分
      标题title：10分 
      域名：7分 
      H1，H2字号标题：5分 
      每段首句：5分 
      路径或文件名：4分 
      相似度（关键词堆积）：4分 
      每句开头：1.5分 
      加粗或斜体：1分 
      文本用法（内容）：1分 
      title属性：如a href=… title= 
      alt标记：0.5分 
      Meta描述（Description属性）：0.5分 
      Meta关键词（Keywords属性）：0.05分
    ```
- 外链
  外链是指自己网站的链接放到第三方网站，这样如果爬虫爬取第三方网站时候也会爬取到自己的网站内容，一般我们会选择一些热门网站外置外链，增加自己网站的访问量。
- robots.txt
  `robots` 是网站跟爬虫间的协议，用简单直接的txt格式文本方式告诉对应的爬虫被允许的权限，也就是说robots.txt是搜索引擎中访问网站的时候要查看的第一个文件。当一个搜索蜘蛛访问一个站点时，它会首先检查该站点根目录下是否存在robots.txt

  ```
    User-agent: Baiduspider  // 指定搜索引擎 * 表示所有
    Aallow: /home  //允许爬取的路由
    Disallow: /user //禁止爬取的路由
    Sitemap: http://domain.com/sitemap.xml //指定站点地图
  ```
- sitemap
  sitemap是引导蜘蛛抓取网站内容的最为有效的方式之一, 可以在robots.txt 指定sitemap地址，让爬虫先收录sitemap里面的url，之后再引导爬取。也可以主动提交sitemap.xml到搜索引擎站点， 例如百度站长
  ```
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>http://fuersite.coding.me/2018/10/16/seo%E4%BC%98%E5%8C%96/</loc>
        <lastmod>2018-11-15T23:59:58.262Z</lastmod>
        <data>
            <display>
            <title>前端SEO优化-单页面应用SEO优化</title>
            <pubTime>2018-10-16T13:43:08.000Z</pubTime>
            
            <tag>SEO</tag>
            
            <tag>前端SEO优化</tag>
            
          
            
              
                <breadCrumb title="javascript" url="http://fuersite.coding.me/all-categories/javascript/"/>
            
          </display>
        </data>
      </url>
    </urlset>
  ```
- 关键词排名
  你的网站的有很多被收录的关键词，当你的网站外链很多，访问量很大的时候，你网站中的关键词排名就会得到恨到提升。

- 传统静态页面与单页面应用
  1. 传统静态页面，多个入口，每个url对应一个静态页面文件, 易于SEO。
  2. 单页面应用，一个index.html 入口文件，各个路由对应页面内容是浏览器通过js进行渲染出来的，爬虫能够爬取到的只有index.html和js文件引用。

## 如何让搜索引擎知道，并且爬取网站？
  在网站建立初期，如果不做一些SEO处理，网站很难被搜索引擎搜索出来。

  - 大量经常性访问站点，提高某些关键词访问热度，引起搜索引擎发现，进行爬取收录。（速度太慢，见效差）
  - 在热门站点添加外链，热门论坛博客都可以。增加爬虫爬取链接机会。（速度快，可能需要某些费用）
  - 蹭热度，在网站某些关键词，链接文字使用当前网络中热度文字。（热门词不一定跟网站关键字相近，造成网站主题不明确）
  - 主动提交网站链接到搜索引擎站点，例如百度站长。把sitemap.xml主动提交站点，一般隔天就回去爬取 （网站更新，都要重新提交）

## 如何优化网站，有利于爬虫爬取？
  - html标签的优化，尽量使用语义化，图片，链接优化。
  - 网站标题、关键字、描述优化。
  - 利用爬虫原理，页面当中添加其他链接，但是要避免回路。
  - 网站增加robots.tx ,爬虫最新爬取到它。
  - 编写sitemap.xml引导爬虫。
  - 网站结构布局优化，采用用扁平化结构-网站的目录层级要尽可能少，中小型网站不要超过3级。

## 单页面应用SEO优化
  前后端分离开发在开发效率上确实很大提升，但是确不利于SEO。单页面应用只有一个入口，其他路由都是浏览器加载js后渲染出来的，也就是说爬虫访问http是获取到的只是一个入口文件。

  ### SPA SEO优化方式无非是两种：

  - 采用ssr（服务端渲染）
    服务端渲染就是在服务器端组装页面和数据再返回html页面给前端， 传统的web应用就是这样的。
  - phantomjs/puppeteer  （预渲染）
    1. PhantomJS是一个基于webkit的JavaScript API。它使用QtWebKit作为它核心浏览器的功能，使用webkit来编译解释执行JavaScript代码。任何你可以在基于webkit浏览器做的事情，它都能做到。 puppeteer也是类似的库。

    2. 预渲染是指给单页面应用的路由预先生成一个html页面，里面一些预先需要做seo的信息数据（title,meta 等等），真正的服务端数据还是要等到浏览器渲染之后发起ajax请求获取数据。

    3. vue 预渲染插件`prerender-spa-plugin` 里面的 `puppeteer`包就是使用chromium 引擎来预渲染页面。因为chrome引擎包很大，而且需要翻墙,可以使用淘宝镜像下载，或者单独下载放入`puppeteer` 下面的.local-chromium
    文件夹下。


参考
> https://blog.csdn.net/JasonHector/article/details/79164767
> https://blog.csdn.net/eeeecw/article/details/80591511
> https://www.jianshu.com/p/8f82459895c9