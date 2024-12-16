---
title: vue2.x中keep-alive源码阅读
date: 2023-05-31
tags: ['keep-alive', 'Vue2', '源码']
description: 简单阅读keep-alive源码，熟练使用方法并理解其原理
---

## 源码分析

---

### 完整代码 ( 源代码及注释转载自 [keep-alive 源码解析及实现原理](https://blog.csdn.net/xiao1215fei/article/details/126241114) ):

```js
export default {
  name: 'keep-alive',
  // keep-alive 是一个抽象组件，抽象组件不会渲染成 DOM 元素，也不会出现在父组件链中
  abstract: true,

  props: {
    // 缓存白名单
    // 字符串或正则表达式。只有名称匹配的组件会被缓存。
    include: patternTypes,
    // 缓存黑名单
    // 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
    exclude: patternTypes,
    // 数字。最多可以缓存多少组件实例。
    max: [String, Number]
  },

  created() {
    // 用于缓存 vnode 的对象
    this.cache = Object.create(null)
    // 已缓存的 vnode 的 key 集合
    this.keys = []
  },

  destroyed() {
    // 清空所有缓存的 vnode
    // 使用 for in 遍历 this.cache 对象
    for (const key in this.cache) {
      // 借助 pruneCacheEntry 方法移除缓存的 vnode
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  // 这里借助 watch 监控 include prop 和 exclude prop
  // 如果这两个 prop 有变化的话，则按照最新的 include 和 exclude 更新 this.cache
  // 将不满足 include、exclude 限制的 缓存vnode 从 this.cache 中移除
  watch: {
    include(val: string | RegExp | Array<string>) {
      pruneCache(this, (name) => matches(val, name))
    },
    exclude(val: string | RegExp | Array<string>) {
      pruneCache(this, (name) => !matches(val, name))
    }
  },

  // 组件重新渲染时，会执行 render 函数获取对应的 vnode，在这里，keep-alive 通过返回指定的 vnode 实现其本身的功能
  //
  // 实现 keep-alive 的功能有两个要点：(1)缓存组件的 Vue 实例；(2)缓存组件上次渲染的真实 DOM；
  // keep-alive 会在 cache 对象中缓存子组件的 vnode，vnode 有个 componentInstance 属性，
  // 这个 componentInstance 属性就是缓存的 Vue 实例，在 componentInstance 属性中有个 $el 属性，
  // 这个 $el 属性是缓存的真实 DOM
  //
  // 当 keep-alive 的子组件是已经渲染过一次的组件时，通过还原缓存的 Vue 实例和缓存的真实 DOM，
  // 实现 keep-alive 组件的功能
  render() {
    // 获取 keep-alive 组件子节点中的第一个组件 vnode
    const vnode: VNode = getFirstComponentChild(this.$slots.default)
    // 获取组件的配置选项对象
    const componentOptions: ?VNodeComponentOptions =
      vnode && vnode.componentOptions
    if (componentOptions) {
      // 获取组件的名称
      const name: ?string = getComponentName(componentOptions)
      // 如果当前的组件 name 不在 include 中或者组件的 name 在 exclude 中
      // 说明当前的组件是不被 keep-alive 所缓存的，此时直接 return vnode 即可
      if (
        name &&
        ((this.include && !matches(this.include, name)) ||
          (this.exclude && matches(this.exclude, name)))
      ) {
        return vnode
      }
      // 代码执行到这里，说明当前的组件受 keep-alive 组件的缓存

      const { cache, keys } = this
      // 定义 vnode 缓存用的 key
      const key: ?string =
        vnode.key == null
          ? componentOptions.Ctor.cid +
            (componentOptions.tag ? `::${componentOptions.tag}` : '')
          : vnode.key

      // 如果 cache[key] 已经存在的话，则说明当前的组件 vnode 已经被缓存过了,此时需要将其恢复还原出来
      if (cache[key]) {
        // 将缓存的 Vue 实例赋值给 vnode.componentInstance
        vnode.componentInstance = cache[key].componentInstance
        // 先从 keys 中移除 key，然后再 push key，这可以保证当前的 key 在 keys 数组中的最后面
        remove(keys, key)
        keys.push(key)
      } else {
        // 如果 cache[key] 不存在的话，说明当前的子组件是第一次出现，此时需要将 vnode 缓存到 cache 中
        cache[key] = vnode
        // 将 key 存储到 keys 字符串数组中
        keys.push(key)
        // 接下来的代码是 max prop 功能的实现。
        // 如果用户定义了 max prop，并且当前缓存的 vnode 的数量大于 max 的话，
        // 将 cache 对象中缓存时间最久没被使用（[keys[0]]）的 vnode 移除掉
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      // 将 vnode.data.keepAlive 属性设置为 true，这对 vnode 有一个标识的作用，标识这个
      // vnode 是 keep-alive 组件的 render 函数 return 出去的，这个标识在下面的运行代码中有用
      vnode.data.keepAlive = true
    }
    return vnode
  }
}

// 用于移除 cache 中不满足 filter 条件的 vnode
function pruneCache(keepAliveInstance: any, filter: Function) {
  const { cache, keys, _vnode } = keepAliveInstance
  // 遍历 cache 对象中已经缓存的 vnode
  for (const key in cache) {
    // 获取当前遍历的 vnode
    const cachedNode: ?VNode = cache[key]
    // 如果当前遍历的 vnode 不是 null 的话
    if (cachedNode) {
      // 获取当前遍历 vnode 对应的组件名称
      const name: ?string = getComponentName(cachedNode.componentOptions)
      // 如果组件名称不满足 filter 条件的话，则调用 pruneCacheEntry 方法将当前遍历的 vnode 移除
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}

// 该方法用于移除 cache 中缓存的指定 vnode，并销毁 vnode 对应的组件实例
function pruneCacheEntry(
  // 用于缓存 vnode 的对象
  cache: VNodeCache,
  // 当前要移除 vnode 的 key
  key: string,
  // 已缓存 vnode 的 key 集合
  keys: Array<string>,
  // keep-alive 内当前渲染组件的 vnode
  current?: VNode
) {
  // 使用 key 从 cache 中获取缓存的指定 vnode
  const cached = cache[key]
  if (cached && cached !== current) {
    // 触发执行 vnode 对应组件实例的 $destroy 方法
    cached.componentInstance.$destroy()
  }
  // 将 cache 对象中的 key 置为 null，删除缓存的 vnode
  cache[key] = null
  // 从 key 集合数组中移除 key
  remove(keys, key)
}
```

---
