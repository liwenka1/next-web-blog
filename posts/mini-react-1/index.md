---
title: React的最小实现（一）
date: 2024-12-17
tags: ["React"]
description: createElement函数和render函数的实现
---

## 前言

本系列文章将对 React 完成最小的实现。
第一章主要实现 createElement 函数和 render 函数，createElement 函数的作用是实现 jsx 向 js 的转换。
render 函数则是进行实际的渲染工作。

## createElement 函数

编写前我们需要知道 React 中 createElement 的函数细节。

从 React 文档中我们可以知道 createElement 可以来创建一个 React 元素，它有 type、props 和 children 三个参数。

- type：type 参数必须是一个有效的 React 组件类型，例如一个字符串标签名（如 'div' 或 'span'），或一个 React 组件（一个函数式组件、一个类式组件，或者是一个特殊的组件如 Fragment）。
- props：props 参数必须是一个对象或 null。如果你传入 null，它会被当作一个空对象。创建的 React 元素的 props 与这个参数相同。注意，props 对象中的 ref 和 key 比较特殊，它们 不会 作为 element.props.ref 和 element.props.key 出现在创建的元素 element 上，而是作为 element.ref 和 element.key 出现。
- 可选 ...children：零个或多个子节点。它们可以是任何 React 节点，包括 React 元素、字符串、数字、portal、空节点（null、undefined、true 和 false），以及 React 节点数组。

```js
import { createElement } from "react"

function Greeting({ name }) {
  return createElement("h1", { className: "greeting" }, "你好")
}
```

那么什么是 React 元素呢？

我们同样引用文档的概念

> 元素是用来描述一部分用户界面的轻量级结构。比如，`<Greeting name="泰勒" />` 和 createElement(Greeting, { name: '泰勒' }) 都会生成一个这样的对象：

```js
// 极度简化的样子
{
  type: Greeting,
  props: {
    name: '泰勒'
  },
  key: null,
  ref: null,
}
```

到这里我们对于我们的要编写 createElement 函数以及有了一定的目标，同时我们进行再次的简化（我更喜欢简单的代码）。

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children
    }
  }
}
```

因为 children 有可能不是对象，即 children 本身为文本节点内容，因此我们添加 createTextElement 函数做特殊处理。

```js
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => (typeof child === "object" ? child : createTextElement(child.toString())))
    }
  }
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}
```

## render 函数

目前我们只考虑将想 DOM 添加内容，我们使用元素类型来创造节点，然后将新节点添加到容器中。
同时考虑到 children，我们使用递归去实现子节点的挂载。
同时考虑文本元素的特殊情况。

```js
function render(element, container) {
  const dom = element.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)

  Object.keys(element.props).forEach((name) => {
    // 对样式我们进行特殊处理
    if (name === "style" && typeof element.props[name] === "object") {
      Object.assign(dom.style, element.props[name])
    } else if (name !== "children") {
      dom[name] = element.props[name]
    }
  })

  element.props.children?.forEach((child) => render(child, dom))

  container.appendChild(dom)
}
```
