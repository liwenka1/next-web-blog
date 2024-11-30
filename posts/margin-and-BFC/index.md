---
title: 外边距折叠（ margin collapsing ）与区块格式化上下文（ BFC ）
date: 2024-03-18
description: 讲述外边距折叠（ margin collapsing ）的现象与影响以及区块格式化上下文（ BFC ）的现象和影响，同时如何去利用 BFC 来解决 margin collapsing。
---

# 外边距折叠

什么是外边距折叠呢？在英文原文里面叫做 margin collapsing，日常开发中也叫做 margin 塌陷与合并。

MDN 上是如下写的：

> 区块的上下外边距有时会合并（折叠）为单个边距，其大小为两个边距中的最大值（或如果它们相等，则仅为其中一个），这种行为称为外边距折叠。注意：有设定浮动和绝对定位的元素不会发生外边距折叠。

那都在什么情况下会形成外边距折叠呢？有三种情况会形成外边距折叠：

> 相邻的兄弟元素
>
> 相邻的同级元素之间的外边距会被折叠（除非后面的元素需要清除之前的浮动）。

> 没有内容将父元素和后代元素分开
>
> 如果没有设定边框（border）、内边距（padding）、行级（inline）内容，也没有创建区块格式化上下文或间隙来分隔块级元素的上边距（margin-top）与其内一个或多个子代块级元素的上边距（margin-top）；
> 或者没有设定边框、内边距、行级内容、高度（height）或最小高度（min-height）来分隔块级元素的下边距（margin-bottom）与其内部的一个或多个后代后代块元素的下边距（margin-bottom），则会出现这些外边距的折叠，重叠部分最终会溢出到父代元素的外面。

> 空的区块
>
> 如果块级元素没有设定边框、内边距、行级内容、高度（height）、最小高度（min-height）来分隔块级元素的上边距（margin-top）及其下边距（margin-bottom），则会出现其上下外边距的折叠。

## 示例

### 相邻的兄弟元素

export const BrotherExampleF = () => {
  return (
    <>
      <div className="mb-10 h-20 w-full bg-red-300"></div>
      <div className="mt-10 h-20 w-full bg-blue-300"></div>
    </>
  )
}

<BrotherExampleF />

```tsx
export const BrotherExampleF = () => {
  return (
    <>
      <div className="mb-10 h-20 w-full bg-red-300"></div>
      <div className="mt-10 h-20 w-full bg-blue-300"></div>
    </>
  )
}
```

export const BrotherExampleT = () => {
  return (
    <>
      <div className="mb-20 h-20 w-full bg-red-300"></div>
      <div className="h-20 w-full bg-blue-300"></div>
    </>
  )
}

<BrotherExampleT />

```tsx
export const BrotherExampleT = () => {
  return (
    <>
      <div className="mb-20 h-20 w-full bg-red-300"></div>
      <div className="h-20 w-full bg-blue-300"></div>
    </>
  )
}
```

通过这俩个组件我们可以看出，第一个组件的外边距相加为20，但是却和我们第二个组件的20明显不同，这时候便是发生了外边距折叠。

### 没有内容将父元素和后代元素分开

export const FatherExampleF = () => {
  return (
    <>
      <div className="h-20 w-full bg-green-300"></div>
      <div className="mt-10 h-20 w-full bg-red-300">
        <div className="mt-10 h-10 w-1/2 bg-blue-300"></div>
      </div>
    </>
  )
}

<FatherExampleF />

```tsx
export const FatherExampleF = () => {
  return (
    <>
      <div className="h-20 w-full bg-green-300"></div>
      <div className="mt-10 h-20 w-full bg-red-300">
        <div className="mt-10 h-10 w-1/2 bg-blue-300"></div>
      </div>
    </>
  )
}

```

export const FatherExampleT = () => {
  return (
    <>
      <div className="h-20 w-full bg-green-300"></div>
      <div className="mt-10 flow-root h-20 w-full bg-red-300">
        <div className="mt-10 h-10 w-1/2 bg-blue-300"></div>
      </div>
    </>
  )
}

<FatherExampleT />

```tsx
export const FatherExampleT = () => {
  return (
    <>
      <div className="h-20 w-full bg-green-300"></div>
      <div className="mt-10 flow-root h-20 w-full bg-red-300">
        <div className="mt-10 h-10 w-1/2 bg-blue-300"></div>
      </div>
    </>
  )
}
```

以上代码不难看出，在我们对父元素没有添加 flow-root 属性时候，父元素和子元素的外边距发生了折叠。
但是为什么添加 flow-root 后就消除了这个问题了呢？我们在下半部分会揭晓答案。

### 空的区块

export const EmptyExampleF = () => {
  return (
    <>
      <div className="h-20 w-full bg-green-300"></div>
      <div className="mb-10 mt-10 w-full bg-red-300"></div>
      <div className="h-20 w-full bg-blue-300"></div>
    </>
  )
}

<EmptyExampleF />

```tsx
export const EmptyExampleF = () => {
  return (
    <>
      <div className="h-20 w-full bg-green-300"></div>
      <div className="mb-10 mt-10 w-full bg-red-300"></div>
      <div className="h-20 w-full bg-blue-300"></div>
    </>
  )
}
```

export const EmptyExampleT = () => {
  return (
    <>
      <div className="h-20 w-full bg-green-300"></div>
      <div className="mt-20 w-full bg-red-300"></div>
      <div className="h-20 w-full bg-blue-300"></div>
    </>
  )
}

<EmptyExampleT />

```tsx
export const EmptyExampleT = () => {
  return (
    <>
      <div className="h-20 w-full bg-green-300"></div>
      <div className="mt-20 w-full bg-red-300"></div>
      <div className="h-20 w-full bg-blue-300"></div>
    </>
  )
}
```

和上述的第一种情况类似，在使用空的区块时也显而易见的产生了外边距折叠。

# 区块格式化上下文

同样引用 MDN 对区块格式化上下文的定义：

> 区块格式化上下文（Block Formatting Context，BFC）是 Web 页面的可视 CSS 渲染的一部分，是块级盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

下列方式会创建块格式化上下文：

> - 文档的根元素（`<html>`）。
> - 浮动元素（既 float 值不为 none 的元素）。
> - 绝对定位元素（ position 值为 absolute 或 fixed 的元素）。
> - 行内块元素（ display 为 inline-block 的元素）。
> - 表单单元格（ display 为 table-cell，HTML 表格单元格默认值）。
> - 表单标题（ display 值为 table-caption，HTML 表格标题默认值）。
> - 匿名表格单元格元素（display 值为 table（HTML 表格默认值）、table-row（表格行默认值）、table-row-group（表格体默认值）、table-header-group（表格头部默认值）、table-footer-group（表格尾部默认值）或 inline-table）。
> - overflow 值不为 visible 或 clip 的块级元素。
> - display 值为 flow-root 的元素。
> - contain 值为 layout、content 或 paint 的元素。
> - 弹性元素（display 值为 flex 或 inline-flex 元素的直接子元素），如果它们本身既不是弹性、网格也不是表格容器。
> - 网格元素（display 值为 grid 或 inline-grid 元素的直接子元素），如果它们本身既不是弹性、网格也不是表格容器。
> - 多列容器（column-count 或 column-width 值不为 auto，且含有 column-count: 1 的元素）。
> - column-span 值为 all 的元素始终会创建一个新的格式化上下文，即使该元素没有包裹在一个多列容器中。

格式化上下文影响布局，通常，我们会为定位和清除浮动创建新的 BFC，而不是更改布局，因为它将：

- 包含内部浮动。
- 排除外部浮动。
- 阻止外边距重叠。

> 备注：弹性/网格容器（display：flex/grid/inline-flex/inline-grid）建立新的弹性/网格格式化上下文，除布局之外，它与区块格式化上下文类似。弹性/网格容器中没有可用的浮动子级，但排除外部浮动和阻止外边距重叠仍然有效

## 示例

### 包含内部浮动

export const ContainInternalFloatsF = () => {
  return (
    <div className="w-full border bg-red-300">
      <div className="float-left h-40 border border-black">我是浮动</div>
      <p>我是内容</p>
    </div>
  )
}

<ContainInternalFloatsF />

<hr className="opacity-0" />

```tsx
export const ContainInternalFloatsF = () => {
  return (
    <div className="w-full border bg-red-300">
      <div className="float-left h-40 border border-black">我是浮动</div>
      <p>我是内容</p>
    </div>
  )
}
```

export const ContainInternalFloatsT = () => {
  return (
    <div className="flow-root w-full border bg-red-300">
      <div className="float-left h-40 border border-black">我是浮动</div>
      <p>我是内容</p>
    </div>
  )
}

<ContainInternalFloatsT />

```tsx
export const ContainInternalFloatsT = () => {
  return (
    <div className="flow-root w-full border bg-red-300">
      <div className="float-left h-40 border border-black">我是浮动</div>
      <p>我是内容</p>
    </div>
  )
}
```

可以看到在我们为父元素添加 **flow-root** 属性形成 **BFC** 后，子元素的浮动内容不会从底部溢出，这便是 **包含内部浮动** 的现象，既 **BFC 使得让浮动内容和周围的内容等高**。

### 排除外部浮动

export const ExcludeExternalFloatsF = () => {
  return (
    <div className="h-40">
      <div className="float-left mr-5 h-28 w-1/2 border-2 border-black"></div>
      <div className="border bg-red-300">
        <p>普通</p>
      </div>
    </div>
  )
}

<ExcludeExternalFloatsF />

```tsx
export const ExcludeExternalFloatsF = () => {
  return (
    <div className="h-40">
      <div className="float-left mr-5 h-28 w-1/2 border-2 border-black"></div>
      <div className="border bg-red-300">
        <p>普通</p>
      </div>
    </div>
  )
}
```

export const ExcludeExternalFloatsT = () => {
  return (
    <div className="h-40">
      <div className="float-left mr-5 h-28 w-1/2 border-2 border-black"></div>
      <div className="flow-root border bg-red-300">
        <p>普通</p>
      </div>
    </div>
  )
}

<ExcludeExternalFloatsT />

```tsx
export const ExcludeExternalFloatsT = () => {
  return (
    <div className="h-40">
      <div className="float-left mr-5 h-28 w-1/2 border-2 border-black"></div>
      <div className="flow-root border bg-red-300">
        <p>普通</p>
      </div>
    </div>
  )
}
```

同时我们还可以利用 **BFC** 的 **排除外部浮动** 特性来实现 **双列布局**。

> 上面的例子中，我们使用 display: flow-root 和浮动实现双列布局，因为正常文档流中建立的 BFC 不得与元素本身所在的块格式化上下文中的任何浮动的外边距重叠。

> 与 inline-block 需要设置 width: `<percentage>` 不同的是，在示例中，我们不需要设置右侧 div 元素的宽度。

> 请注意，弹性盒子是在现代 CSS 中实现多列布局的更有效的方法。

### 阻止外边距重叠

到了这里上半部分遗留的问题就得到了答案，也就是说解决外边距折叠的方法就是可以利用 BFC。

这里我们再拿刚才的例子来看：

<FatherExampleF />

```tsx
export const FatherExampleF = () => {
  return (
    <>
      <div className="h-20 w-full bg-green-300"></div>
      <div className="mt-10 h-20 w-full bg-red-300">
        <div className="mt-10 h-10 w-1/2 bg-blue-300"></div>
      </div>
    </>
  )
}

```

<FatherExampleT />

```tsx
export const FatherExampleT = () => {
  return (
    <>
      <div className="h-20 w-full bg-green-300"></div>
      <div className="mt-10 flow-root h-20 w-full bg-red-300">
        <div className="mt-10 h-10 w-1/2 bg-blue-300"></div>
      </div>
    </>
  )
}
```

可以得出结论，在第二个组件当中我们给父元素添加了 **flow-root** 形成了 **BFC**，因此阻止了外边距重叠。

但是这仅仅是解决了产生外边距折叠三种情况中的 **没有内容将父元素和后代元素分开** 一种情况，另外两种如何解决呢？

通常来说如果是由于 **相邻的兄弟元素** 和 **空的区块** 并不会选择利用 **BFC** 来解决，因为这样会添加不必要的样式，建议选择和我写的正确示例一样的方法。也就是通过计算边距，将边距整合即可。
