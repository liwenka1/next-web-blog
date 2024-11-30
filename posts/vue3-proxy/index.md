---
title: Vue3响应式原理
date: 2024-04-08
description: 深入了解响应式原理，并且数据劫持 + 发布者订阅者模式来实现一个简单的 Vue 类
---

## proxy

首先利用 proxy 来实现一个简单的数据劫持案例

在下面的例子中，我们通过数据劫持来实现类似于 Vue 的双向绑定

export const ProxyComp = () => {
  const obj = {
    name: 'liwenkai',
    info: {
      iphone: 12138,
      age: 18
    }
  }
  const isObject = (target) => typeof target === 'object' && target !== null
  const observe = (obj) => {
    if (!isObject(obj)) return
    return new Proxy(obj, {
      get(target, key) {
        const value = target[key]
        if (isObject(value)) {
          return observe(value)
        }
        return value
      },
      set(target, key, value) {
        const oldValue = target[key]
        if (oldValue !== value) {
          Reflect.set(target, key, value)
          if (isObject(value)) {
            observe(value)
          }
          if (key === 'name') spanNameRef.current.innerHTML = value
          else if (key === 'iphone') spanIponeRef.current.innerHTML = value
          else if (key === 'age') spanAgeRef.current.innerHTML = value
        }
      }
    })
  }
  const proxy_obj = observe(obj)
  const [inputName, setInputName] = React.useState(proxy_obj.name)
  const [inputIphone, setInputIphone] = React.useState(proxy_obj.info.iphone)
  const [inputAge, setInputAge] = React.useState(obj.info.age)
  const inputChange = (v, k) => {
    if (k === 'name') {
      setInputName(v)
      proxy_obj.name = v
    } else if (k === 'iphone') {
      setInputIphone(v)
      proxy_obj.info.iphone = v
    } else if (k === 'age') {
      setInputAge(v)
      proxy_obj.info.age = v
    }
  }
  const spanNameRef = React.useRef(null)
  const spanIponeRef = React.useRef(null)
  const spanAgeRef = React.useRef(null)
  return (
    <div className="flex flex-col">
      <span className="w-full rounded bg-blue-500 p-2" ref={spanNameRef}>
        {proxy_obj.name}
      </span>
      <input
        className="flex-1 rounded border bg-blue-500 p-2"
        placeholder="输入名字"
        value={inputName}
        onChange={(e) => inputChange(e.target.value, 'name')}
      />
      <span className="w-full rounded bg-blue-500 p-2" ref={spanIponeRef}>
        {proxy_obj.info.iphone}
      </span>
      <input
        className="flex-1 rounded border bg-blue-500 p-2"
        placeholder="输入电话"
        value={inputIphone}
        onChange={(e) => inputChange(e.target.value, 'iphone')}
      />
      <span className="w-full rounded bg-blue-500 p-2" ref={spanAgeRef}>
        {proxy_obj.info.age}
      </span>
      <input
        className="flex-1 rounded border bg-blue-500 p-2"
        placeholder="输入年龄"
        value={inputAge}
        onChange={(e) => inputChange(e.target.value, 'age')}
      />
    </div>
  )
}

<ProxyComp />

## vue 类

export const VueComp = () => {
  const isObject = (target) => typeof target === 'object' && target !== null
  const reactive = (target) => {
    return new Proxy(target, {
      get(target, key, receiver) {
        // Reflect 对象取值
        let res = Reflect.get(target, key, receiver)
        // 依赖收集
        track(target, key)
        // 递归
        if (isObject(res)) {
          return reactive(res)
        }
        return res
      },
      set(target, key, value, receiver) {
        // Reflect 对象赋值 返回 Boolean
        let res = Reflect.set(target, key, value, receiver)
        // 依赖更新
        trigger(target, key)
        return res
      }
    })
  }
  const effectStack = []
  const effect = (fn) => {
    const e = createReactiveEffect(fn)
    // 立即执行
    e()
    return e
  }
  const createReactiveEffect = (fn) => {
    const effect = () => {
      try {
        effectStack.push(effect)
        return fn()
      } finally {
        effectStack.pop()
      }
    }
    return effect
  }
  const targetMap = new WeakMap()
  // 依赖收集
  const track = (target, key) => {
    const effect = effectStack[effectStack.length - 1]
    if (effect) {
      let fistDeepMap = targetMap.get(target)
      if (!fistDeepMap) {
        fistDeepMap = new Map()
        targetMap.set(target, fistDeepMap)
      }
      let secondDeepMap = fistDeepMap.get(key)
      if (!secondDeepMap) {
        secondDeepMap = new Set()
        fistDeepMap.set(key, secondDeepMap)
      }
      secondDeepMap.add(effect)
    }
  }
  // 依赖更新
  const trigger = (target, key) => {
    const fistDeepMap = targetMap.get(target)
    if (!fistDeepMap) return
    const secondDeepMap = fistDeepMap.get(key)
    if (secondDeepMap) secondDeepMap.forEach((effect) => effect())
  }
  // 模板解析
  const compile = (obj) => {
    const element = document.querySelector('#app')
    const fragment = document.createDocumentFragment()
    let child
    while ((child = element.firstChild)) {
      fragment.append(child)
    }
    // 替换文档碎片内容
    const fragment_compile = (node) => {
      const xxx = node.nodeValue
      const pattern = /\(\(\s*(\S+)\s*\)\)/
      if (node.nodeType === 3) {
        console.log(node, obj, node.nodeType, 'node')
        const result_regex = pattern.exec(node.nodeValue)
        if (result_regex) {
          const arr = result_regex[1].split('.')
          const value = arr.reduce((total, current) => total[current], obj)
          node.nodeValue = xxx.replace(pattern, value)
        }
        return
      }
      if (node.nodeType === 1 && node.nodeName === 'INPUT') {
        const attr = Array.from(node.attributes)
        attr.forEach((i) => {
          if (i.nodeName === 'v-model') {
            const value = i.nodeValue.split('.').reduce((total, current) => total[current], obj)
            node.value = value
            // 添加监听
            node.addEventListener('input', (e) => {
              const arr1 = i.nodeValue.split('.')
              const arr2 = arr1.slice(0, arr1.length - 1)
              const final = arr2.reduce((total, current) => total[current], obj)
              final[arr1[arr1.length - 1]] = e.target.value
            })
          }
        })
      }
      node.childNodes.forEach((child) => fragment_compile(child))
    }
    fragment_compile(fragment)
    element.appendChild(fragment)
  }
  const obj = reactive({
    name: 'liwenkai',
    info: {
      iphone: 12138,
      age: 18
    }
  })
  React.useEffect(() => {
    effect(() => {
      console.log('effect', obj.name, obj.info.iphone)
    })
    compile(obj)
  }, [])
  return (
    <div id="app" className="flex flex-col">
      <span className="w-full rounded bg-blue-500 p-2">名字：((name))</span>
      <input className="flex-1 rounded border bg-blue-500 p-2" placeholder="输入名字" v-model="name" />
    </div>
  )
}

<VueComp />
