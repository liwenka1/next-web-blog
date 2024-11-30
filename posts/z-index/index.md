---
title: 理解 CSS 的 z-index 属性
date: 2024-03-21
description: 通过一些例子来讲述 z-index 的一些规则以及进行简单直白的图层优先级分析。
---

# 前言

在 MDN 上面这样讲到 z-index ：

> 通常情况下，HTML 页面可以被认为是二维的，因为文本，图像和其他元素被排列在页面上而不重叠。在这种情况下，只有一个渲染进程，所有元素都知道其他元素所占用的空间。z-index 属性可让你在渲染内容时调整对象分层的顺序。

> 在 CSS 2.1 中，所有的盒模型元素都处于三维坐标系中。除了我们常用的横坐标和纵坐标，盒模型元素还可以沿着“z 轴”层叠摆放，当他们相互覆盖时，z 轴顺序就变得十分重要。

> 这意味着其实 CSS 允许你在现有的渲染引擎上层叠的摆放盒模型元素。所有的层都可以用一个整数 ( z 轴顺序) 来表明当前层在 z 轴的位置。数字越大，元素越接近观察者。Z 轴顺序用 CSS 的 z-index 属性来指定。

> 使用 z-index 很简单：给它指定一个整数值即可。然而，在层叠比较复杂的 HTML 元素上使用 z-index 时，结果可能让人觉得困惑，甚至不可思议。这是由复杂的元素排布规则导致的。

# 示例

下面将参考 MDN 来利用一些简单的例子解释一些相关规则。

## 不含 z-index 的堆叠

默认的摆放规则，即不含有 z-index 属性时

> 当没有元素包含 z-index 属性时，元素按照如下顺序堆叠（从底到顶顺序）：

> 1. 根元素的背景和边界

> 2. 普通流 (无定位) 里的块元素 (没有 position 或者 position:static;) 按 HTML 中的出现顺序堆叠

> 3. 定位元素按 HTML 中的出现顺序堆叠

> 在接下来的例子中，相对和绝对定位的块元素的大小和位置刚好说明上述堆叠规则。

export const WithoutZIndex = () => {
  return (
    <div className="relative text-center text-black">
      <div className="absolute left-0 top-0 h-full w-40 border border-dotted border-black bg-red-300">
        absolute:div1
      </div>
      <div className="relative left-10 top-20 h-20 w-4/5 border border-dotted border-black bg-orange-300">
        relative:div2
      </div>
      <div className="relative left-10 top-10 h-40 w-4/5 border border-dotted border-black bg-yellow-300">
        relative:div3
      </div>
      <div className="absolute right-0 top-0 h-full w-40 border border-dotted border-black bg-green-300">
        absolute:div4
      </div>
      <div className="ml-10 flex h-20 w-4/5 items-end justify-center border border-dotted border-black bg-teal-300">
        normal:div5
      </div>
    </div>
  )
}

<WithoutZIndex />

```tsx
export const WithoutZIndex = () => {
  return (
    <div className="relative text-center text-black">
      <div className="absolute left-0 top-0 h-full w-40 border border-dotted border-black bg-red-300">
        absolute:div1
      </div>
      <div className="relative left-10 top-20 h-20 w-4/5 border border-dotted border-black bg-orange-300">
        relative:div2
      </div>
      <div className="relative left-10 top-10 h-40 w-4/5 border border-dotted border-black bg-yellow-300">
        relative:div3
      </div>
      <div className="absolute right-0 top-0 h-full w-40 border border-dotted border-black bg-green-300">
        absolute:div4
      </div>
      <div className="ml-10 flex h-20 w-4/5 items-end justify-center border border-dotted border-black bg-teal-300">
        normal:div5
      </div>
    </div>
  )
}
```

堆叠顺序：4>3>2>1>5

## 层叠与浮动

浮动元素的处理方式

> 对于浮动的块元素来说，层叠顺序变得有些不同。浮动块元素被放置于非定位块元素与定位块元素之间：

> 1. 根元素的背景与边框

> 2. 位于普通流中的后代块元素按照它们在 HTML 中出现的顺序层叠

> 3. 浮动块元素

> 4. 后代中的定位元素按照它们在 HTML 中出现的顺序层叠

> 实际上，在接下来的例子中你会看到，非定位块元素 (div4) 的背景与边框丝毫不会受到浮动块元素的影响，但内容却恰恰相反。出现这种情况是由于 CSS 的标准浮动行为引起的。

> 这种行为可以通过上一个例子的改进版本来解释：

> 1. 根元素的背景与边框
> 2. 位于普通流中的后代块元素按照它们在 HTML 中出现的顺序层叠
> 3. 浮动块元素
> 4. 常规流中的后代行内元素
> 5. 后代中的定位元素按照它们在 HTML 中出现的顺序层叠

> 备注： 在下面的例子中，除了非定位的那个块元素外，所有的块元素都是半透明的，以便来显示层叠顺序。如果减少非定位元素 (div4) 的透明度，会发生很诡异的事情：该元素的背景和边框会出现在浮动块元素上方，但是仍然处于定位元素的下方。我不能确定这是规范的 bug 或是怪异的解析。(设置透明度会隐式的创建一个层叠上下文。)

export const StackingFloating = () => {
  return (
    <div className="relative flow-root text-center text-black">
      <div className="w-30 absolute left-14 top-10 h-20 border border-dotted border-black bg-red-300">
        absolute:div1
      </div>
      <div className="w-30 float-left ml-4 h-40 border border-dotted border-black bg-orange-300">float-left:div2</div>
      <div className="w-30 float-right mr-4 h-40 border border-dotted border-black bg-yellow-300">float-right:div3</div>
      <div className="mt-5 h-20 w-full border border-dotted border-black bg-teal-300">normal:div4</div>
      <div className="w-30 absolute right-14 top-10 h-20 border border-dotted border-black bg-green-300">
        absolute:div5
      </div>
    </div>
  )
}

<StackingFloating />

```tsx
export const StackingFloating = () => {
  return (
    <div className="relative flow-root text-center text-black">
      <div className="w-30 absolute left-14 top-10 h-20 border border-dotted border-black bg-red-300">
        absolute:div1
      </div>
      <div className="w-30 float-left ml-4 h-40 border border-dotted border-black bg-orange-300">float-left:div2</div>
      <div className="w-30 float-right mr-4 h-40 border border-dotted border-black bg-yellow-300">float-right:div3</div>
      <div className="mt-5 h-20 w-full border border-dotted border-black bg-teal-300">normal:div4</div>
      <div className="w-30 absolute right-14 top-10 h-20 border border-dotted border-black bg-green-300">
        absolute:div5
      </div>
    </div>
  )
}
```

堆叠顺序：1、5>3、2>4

## 添加 z-index

使用 z-index 来改变堆放顺序

> 在第一个例子 **不含 z-index 的堆叠** 中，我们描述了默认的摆放顺序。当你需要指定不同的排列顺序时，只要给元素指定一个 z-index 的数值就可以了。

> 该属性必须是整数 (正负均可)，它体现了元素在 z 轴的位置。如果你对 z 轴体系不了解，你也可以把它理解成“层叠”，每个层都有一个顺序数，顺序数大的层在上面，小的在下面。

> 注意！z-index 只对指定了 positioned属性的元素有效。

> 备注：
>
> - 当没有指定 z-index 的时候，所有元素都在会被渲染在默认层 (0 层)
> - 当多个元素的 z-index 属性相同的时候 (在同一个层里面)，那么将按照 Stacking without z-index 中描述的规则进行布局。

export const AddingZIndex = () => {
  return (
    <div className="relative text-center text-black">
      <div className="absolute left-0 top-0 z-40 h-full w-40 border border-dotted border-black bg-red-300">
        absolute:div1 z-40
      </div>
      <div className="relative left-10 top-20 z-30 h-20 w-4/5 border border-dotted border-black bg-orange-300">
        relative:div2 z-30
      </div>
      <div className="relative left-10 top-10 z-20 flex h-40 w-4/5 items-end justify-center border border-dotted border-black bg-yellow-300">
        relative:div3 z-20
      </div>
      <div className="absolute right-0 top-0 z-10 h-full w-40 border border-dotted border-black bg-green-300">
        absolute:div4 z-10
      </div>
      <div className="z-50 ml-10 flex h-20 w-4/5 items-end justify-center border border-dotted border-black bg-teal-300">
        no positioning:div5 z-50
      </div>
    </div>
  )
}

<AddingZIndex />

```tsx
export const AddingZIndex = () => {
  return (
    <div className="relative text-center text-black">
      <div className="absolute left-0 top-0 z-40 h-full w-40 border border-dotted border-black bg-red-300">
        absolute:div1 z-40
      </div>
      <div className="relative left-10 top-20 z-30 h-20 w-4/5 border border-dotted border-black bg-orange-300">
        relative:div2 z-30
      </div>
      <div className="relative left-10 top-10 z-20 flex h-40 w-4/5 items-end justify-center border border-dotted border-black bg-yellow-300">
        relative:div3 z-20
      </div>
      <div className="absolute right-0 top-0 z-10 h-full w-40 border border-dotted border-black bg-green-300">
        absolute:div4 z-10
      </div>
      <div className="z-50 ml-10 flex h-20 w-4/5 items-end justify-center border border-dotted border-black bg-teal-300">
        no positioning:div5 z-50
      </div>
    </div>
  )
}
```

堆叠顺序：1>2>3>4>5

## 层叠上下文

内容堆放注意事项

> 在本篇之前的部分——**运用 z-index**，（我们认识到）某些元素的渲染顺序是由其 z-index 的值影响的。这是因为这些元素具有能够使他们形成一个层叠上下文的特殊属性。

> 文档中的层叠上下文由满足以下任意一个条件的元素形成：
>
> - 文档根元素（`<html>`）；
> - position 值为 absolute（绝对定位）或 relative（相对定位）且 z-index 值不为 auto 的元素；
> - position 值为 fixed（固定定位）或 sticky（粘滞定位）的元素（沾滞定位适配所有移动设备上的浏览器，但老的桌面浏览器不支持）；
> - flex (flex) 容器的子元素，且 z-index 值不为 auto；
> - grid (grid) 容器的子元素，且 z-index 值不为 auto；
> - opacity 属性值小于 1 的元素（参见 the specification for opacity）；
> - mix-blend-mode 属性值不为 normal 的元素；
> - 以下任意属性值不为 none 的元素：
> - transform
> - filter
> - backdrop-filter
> - perspective
> - clip-path
> - mask / mask-image / mask-border
> - isolation 属性值为 isolate 的元素；
> - will-change 值设定了任一属性而该属性在 non-initial 值时会创建层叠上下文的元素（参考这篇文章）；
> - contain 属性值为 layout、paint 或包含它们其中之一的合成值（比如 contain: strict、contain: content）的元素。

> 在层叠上下文中，子元素同样也按照上面解释的规则进行层叠。重要的是，其子级层叠上下文的 z-index 值只在父级中才有意义。子级层叠上下文被自动视为父级层叠上下文的一个独立单元。

> 总结：
>
> - 层叠上下文可以包含在其他层叠上下文中，并且一起创建一个层叠上下文的层级。
> - 每个层叠上下文都完全独立于它的兄弟元素：当处理层叠时只考虑子元素。
> - 每个层叠上下文都是自包含的：当一个元素的内容发生层叠后，该元素将被作为整体在父级层叠上下文中按顺序进行层叠。

> 备注： 层叠上下文的层级是 HTML 元素层级的一个子级，因为只有某些元素才会创建层叠上下文。可以这样说，没有创建自己的层叠上下文的元素会被父层叠上下文同化。

export const StackingContext = () => {
  return (
    <div className="relative text-left text-black">
      <div className="relative top-0 z-40 mb-60 h-20 w-full border border-dotted border-black bg-red-300">
        relative:div1 z-40
      </div>
      <div className="relative h-20 w-full border border-dotted border-black bg-orange-300">relative:div2 z-10</div>
      <div className="absolute right-0 top-0 z-30 h-full w-3/5 border border-dotted border-black bg-yellow-300 pt-40">
        <span>absolute:div3 z-30</span>
        <div className="relative -right-5 -top-32 z-50 flex h-20 w-4/5 items-center border border-dotted border-black bg-green-300">
          relative:div4 z-50
        </div>
        <div className="relative -right-5 z-0 h-20 w-4/5 border border-dotted border-black bg-teal-300">
          relative:div5 z-0
        </div>
        <div className="w-30 absolute right-10 top-24 z-40 flex h-52 items-center justify-center border border-dotted border-black bg-blue-300">
          absolute:div6 z-40
        </div>
      </div>
    </div>
  )
}

<StackingContext />

```tsx
export const StackingContext = () => {
  return (
    <div className="relative text-left text-black">
      <div className="relative top-0 z-40 mb-60 h-20 w-full border border-dotted border-black bg-red-300">
        relative:div1 z-40
      </div>
      <div className="relative h-20 w-full border border-dotted border-black bg-orange-300">relative:div2 z-10</div>
      <div className="absolute right-0 top-0 z-30 h-full w-3/5 border border-dotted border-black bg-yellow-300 pt-40">
        <span>absolute:div3 z-30</span>
        <div className="relative -right-5 -top-32 z-50 flex h-20 w-4/5 items-center border border-dotted border-black bg-green-300">
          relative:div4 z-50
        </div>
        <div className="relative -right-5 z-0 h-20 w-4/5 border border-dotted border-black bg-teal-300">
          relative:div5 z-0
        </div>
        <div className="w-30 absolute right-10 top-24 z-40 flex h-52 items-center justify-center border border-dotted border-black bg-blue-300">
          absolute:div6 z-40
        </div>
      </div>
    </div>
  )
}
```

堆叠顺序：1>4>6>5>3>2

## 层叠上下文示例1

在两层元素的第二层上使用 z-index

> 先看一个基础的例子。在根元素的层叠上下文中，有两个都是相对定位且没有设置 z-index 属性的 div（div1 和 div3）。在 div1 中有一个绝对定位的 div2，而在 div3 中有一个绝对定位的 div4，div2 和 div4 也都没有设置 z-index 属性。

export const StackingContextOne = () => {
  return (
    <div className="relative mb-10 text-left text-black">
      <div className="relative mb-10 h-20 border border-dotted border-black bg-red-300">
        relative:div1
        <div className="absolute left-40 z-10 h-40 border border-dotted border-black bg-orange-300">
          absolute:div2 z-10
        </div>
      </div>
      <div className="relative h-20 border border-dotted border-black bg-yellow-300">
        relative:div3
        <div className="absolute left-20 z-20 h-20 border border-dotted border-black bg-green-300">
          absolute:div4 z-20
        </div>
      </div>
    </div>
  )
}

<StackingContextOne />

```tsx
export const StackingContextOne = () => {
  return (
    <div className="relative mb-10 text-left text-black">
      <div className="relative mb-10 h-20 border border-dotted border-black bg-red-300">
        relative:div1
        <div className="absolute left-40 z-10 h-40 border border-dotted border-black bg-orange-300">
          absolute:div2 z-10
        </div>
      </div>
      <div className="relative h-20 border border-dotted border-black bg-yellow-300">
        relative:div3
        <div className="absolute left-20 z-20 h-20 border border-dotted border-black bg-green-300">
          absolute:div4 z-20
        </div>
      </div>
    </div>
  )
}
```

## 层叠上下文示例 2

在两层元素的所有层上使用 z-index

> 这是一个非常简单的例子，但它是理解层叠上下文这个概念的关键。还是和之前的例子中一样的四个 div，不过现在 z-index 属性被分配在两个水平的层次结构中。

export const StackingContextTwo = () => {
  return (
    <div className="relative mb-10 text-left text-black">
      <div className="relative mb-10 h-20 border border-dotted border-black bg-red-300">
        relative:div1
        <div className="absolute left-40 z-20 h-40 border border-dotted border-black bg-orange-300">
          absolute:div2 z-20
        </div>
      </div>
      <div className="relative z-10 h-20 border border-dotted border-black bg-yellow-300">
        relative:div3 z-10
        <div className="absolute left-20 z-30 flex h-20 items-end border border-dotted border-black bg-green-300">
          absolute:div4 z-30
        </div>
      </div>
    </div>
  )
}

<StackingContextTwo />

```tsx
export const StackingContextTwo = () => {
  return (
    <div className="relative mb-10 text-left text-black">
      <div className="relative mb-10 h-20 border border-dotted border-black bg-red-300">
        relative:div1
        <div className="absolute left-40 z-20 h-40 border border-dotted border-black bg-orange-300">
          absolute:div2 z-20
        </div>
      </div>
      <div className="relative z-10 h-20 border border-dotted border-black bg-yellow-300">
        relative:div3 z-10
        <div className="absolute left-20 z-30 flex h-20 items-end border border-dotted border-black bg-green-300">
          absolute:div4 z-30
        </div>
      </div>
    </div>
  )
}
```

## 层叠上下文示例 3

在三层元素的第二层上使用 z-index

> 最后一个例子展示了，在多层级的 HTML 结构中混合了多个定位元素且使用类选择器设置 z-index 属性时出现的问题。

> 我们来看一个用多个定位的 div 实现的三级菜单的例子，二级菜单和三级菜单在鼠标悬停或点击其父元素时才出现，通常这样的菜单在客户端和服务端都是由脚本生成的，所以样式规则不是通过 ID 选择器设置而是通过类选择器设置。

> 如果这个三级菜单有部分区域重叠，管理层叠顺序就会成为一个问题。

> 一级菜单仅仅是相对定位，所以没有创建层叠上下文。

> 二级菜单相对其父元素（一级菜单）绝对定位，要使二级菜单在所有一级菜单的上方，则需要使用 z-index。此时每个二级菜单都创建了一个层叠上下文，而三级菜单也处于其父元素（二级菜单）创建的上下文中。

> 这样一来，在 HTML 结构中处于三级菜单后面的二级菜单，则会显示在三级菜单的上方，因为所有的二级菜单都使用了同样的 z-index 值，所以处于同一个层叠上下文中。

export const Level1 = ({ children }) => {
  return (
    <div className="relative h-32 w-full border border-dotted border-black bg-red-300">relative:Level1{children}</div>
  )
}

export const Level2 = ({ children }) => {
  return (
    <div className="relative left-10 z-10 h-20 w-4/5 border border-dotted border-black bg-orange-300">
      relative:Level2 z-10{children}
    </div>
  )
}

export const Level3 = () => {
  return (
    <div className="relative left-20 h-10 w-1/2 border border-dotted border-black bg-yellow-300">relative:Level3</div>
  )
}

export const StackingContextThree = () => {
  return (
    <div className="relative text-left text-black">
      <Level1>
        <Level2>
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
        </Level2>
        <Level2 />
      </Level1>
      <Level1 />
      <Level1 />
      <Level1 />
    </div>
  )
}

<StackingContextThree />

```tsx
export const Level1 = ({ children }) => {
  return (
    <div className="relative h-32 w-full border border-dotted border-black bg-red-300">relative:Level1{children}</div>
  )
}

export const Level2 = ({ children }) => {
  return (
    <div className="relative left-10 z-10 h-20 w-4/5 border border-dotted border-black bg-orange-300">
      relative:Level2 z-10{children}
    </div>
  )
}

export const Level3 = () => {
  return (
    <div className="relative left-20 h-10 w-1/2 border border-dotted border-black bg-yellow-300">relative:Level3</div>
  )
}

export const StackingContextThree = () => {
  return (
    <div className="relative text-left text-black">
      <Level1>
        <Level2>
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
          <Level3 />
        </Level2>
        <Level2 />
      </Level1>
      <Level1 />
      <Level1 />
      <Level1 />
    </div>
  )
}
```
