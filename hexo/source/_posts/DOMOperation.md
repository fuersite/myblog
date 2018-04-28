---
title: DOMOperation
date: 2018-04-27 15:20:06
categories: javascript
tags:
  - javascript
  - html
  - scrollTop
  - clientHeight
---

DOM 操作小知识

<!-- more -->

### 元素遍历（JavaScript高级程序设计提供方法）

Element Traversal API为DOM元素添加了以下5个属性。

* childElementCount：返回子元素（不包括文本节点和注释）的个数。

* firstElementChild：指向第一个子元素；firstChild的元素版。

* lastElementChild：指向最后一个子元素；lastChild的元素版。

* previousElementSibling：指向前一个同辈元素；previousSibling的元素版。

* nextElementSibling：指向后一个同辈元素；nextSibling的元素版。

1、 过去，要跨浏览器遍历某元素的所有子元素，需要像下面这样写代码。

<pre><code class="javascript">
  var i,
      len,
      child = element.firstChild;
  while(child != element.lastChild){
      if (child.nodeType == 1){   //检查是不是元素
         processChild(child);
      }
      child = child.nextSibling;
  }
</code></pre>
<font size= 4 ></font>

2、 而使用Element Traversal新增的元素，代码会更简洁。(减少了一个nodeType判断)
<pre><code class="javascript">
  var i,
      len,
      child = element.firstElementChild;
  while(child != element.lastElementChild){
      processChild(child);   //已知其是元素
      child = child.nextElementSibling;
  }
</code></pre>

---

### 检查是DOM否包含某子节点（JavaScript高级程序设计提供方法）
1. `contains()`方法
  在实际开发中，经常需要知道某个节点是不是另一个节点的后代。IE为此率先引入了contains()方法，以便不通过在DOM文档树中查找即可获得这个信息。调用contains()方法的应该是祖先节点，也就是搜索开始的节点，这个方法接收一个参数，即要检测的后代节点。如果被检测的节点是后代节点，该方法返回true；否则，返回false。以下是一个例子：

  <pre><code class="javascript">
    alert(document.documentElement.contains(document.body));    //true
  </code></pre>

2. `compareDocumentPosition()` 方法
使用DOM Level 3 compareDocumentPosition()也能够确定节点间的关系。支持这个方法的浏览器有IE9+、Firefox、Safari、Opera 9.5+和Chrome。如前所述，这个方法用于确定两个节点间的关系，返回一个表示该关系的位掩码（ bitmask）。下表列出了这个位掩码的值。
  <pre><code class="javascript">
  var result = document.documentElement.compareDocumentPosition(document.body);
  alert(!!(result & 16));
  </code></pre>

| 掩码 | 节点关系 |
| -----:   | -----:  |
| 1 | 无关（给定的节点不在当前文档中） |
| 2 | 居前（给定的节点在DOM树中位于参考节点之前） |
| 4 | 居后（给定的节点在DOM树中位于参考节点之后） |
| 8 | 包含（给定的节点是参考节点的祖先） |
| 16 | 被包含（给定的节点是参考节点的后代） |

结合以上两个方法，封装一个检查方法：
<pre><code class="javascript">
function contains(refNode, otherNode){
    if (typeof refNode.contains == "function" &&
            (!client.engine.webkit || client.engine.webkit >= 522)){
        return refNode.contains(otherNode);
    } else if (typeof refNode.compareDocumentPosition == "function"){
        return !!(refNode.compareDocumentPosition(otherNode) & 16);
    } else {
        var node = otherNode.parentNode;
        do {
            if (node === refNode){
                return true;
            } else {
                node = node.parentNode;
            }
        } while (node !== null);
        return false;
    }
}
</code></pre>

---

### 理解 DOM clientWidth, clientHeight, offsetLeft, offsetTop, scroll ...
结构图
![dom](http://fuersite.coding.me/images/dom.png)

- clientWidth, clientHeight 为div 内容宽度和长度
- offsetWidht, offsetHeight 为div 内容+border 的宽度和长度
- scrollWidth, scrollHeight 为div 里面 `实际` 内容的宽度和长度（overflow）
- scrollTop， 为滚动条向下滚动时向上超出div内容的长度
- scrollWidth, 为滚动条向右滚动时向左超出div内容的长度
