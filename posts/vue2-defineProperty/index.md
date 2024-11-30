---
title: Vue2响应式原理
date: 2024-04-04
description: 深入了解响应式原理，并且数据劫持 + 发布者订阅者模式来实现一个简单的 Vue 类
---

## 利用 Object.defineProperty 实现数据劫持

首先利用 Object.defineProperty 来实现一个简单的数据劫持案例

在下面的例子中，我们通过数据劫持来实现类似于 Vue 的双向绑定

export const DefinePropertyComp = () => {
  const obj = {
    name: 'liwenkai',
    info: {
      iphone: 12138,
      age: 18
    }
  }
  const observe = (obj) => {
    if (!obj || typeof obj !== 'object') return
    for (const k in obj) {
      let v = obj[k]
      observe(v)
      Object.defineProperty(obj, k, {
        get() {
          return v
        },
        set(val) {
          if (val !== v) {
            v = val
            if (k === 'name') spanNameRef.current.innerHTML = val
            else if (k === 'iphone') spanIponeRef.current.innerHTML = val
            else if (k === 'age') spanAgeRef.current.innerHTML = val
          }
        }
      })
    }
  }
  const [inputName, setInputName] = React.useState(obj.name)
  const [inputIphone, setInputIphone] = React.useState(obj.info.iphone)
  const [inputAge, setInputAge] = React.useState(obj.info.age)
  const inputChange = (v, k) => {
    observe(obj)
    if (k === 'name') {
      setInputName(v)
      obj.name = v
    } else if (k === 'iphone') {
      setInputIphone(v)
      obj.info.iphone = v
    } else if (k === 'age') {
      setInputAge(v)
      obj.info.age = v
    }
  }
  const spanNameRef = React.useRef(null)
  const spanIponeRef = React.useRef(null)
  const spanAgeRef = React.useRef(null)
  return (
    <div className="flex flex-col">
      <span className="w-full rounded bg-blue-500 p-2" ref={spanNameRef}>
        {obj.name}
      </span>
      <input
        className="flex-1 rounded border bg-blue-500 p-2"
        placeholder="输入名字"
        value={inputName}
        onChange={(e) => inputChange(e.target.value, 'name')}
      />
      <span className="w-full rounded bg-blue-500 p-2" ref={spanIponeRef}>
        {obj.info.iphone}
      </span>
      <input
        className="flex-1 rounded border bg-blue-500 p-2"
        placeholder="输入电话"
        value={inputIphone}
        onChange={(e) => inputChange(e.target.value, 'iphone')}
      />
      <span className="w-full rounded bg-blue-500 p-2" ref={spanAgeRef}>
        {obj.info.age}
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

```tsx
export const DefinePropertyComp = () => {
  const obj = {
    name: 'liwenkai',
    info: {
      iphone: 12138,
      age: 18
    }
  }
  const observe = (obj) => {
    if (!obj || typeof obj !== 'object') return
    for (const k in obj) {
      let v = obj[k]
      observe(v)
      Object.defineProperty(obj, k, {
        get() {
          return v
        },
        set(val) {
          if (val !== v) {
            v = val
            if (k === 'name') spanNameRef.current.innerHTML = val
            else if (k === 'iphone') spanIponeRef.current.innerHTML = val
            else if (k === 'age') spanAgeRef.current.innerHTML = val
          }
        }
      })
    }
  }
  const [inputName, setInputName] = React.useState(obj.name)
  const [inputIphone, setInputIphone] = React.useState(obj.info.iphone)
  const [inputAge, setInputAge] = React.useState(obj.info.age)
  const inputChange = (v, k) => {
    observe(obj)
    if (k === 'name') {
      setInputName(v)
      obj.name = v
    } else if (k === 'iphone') {
      setInputIphone(v)
      obj.info.iphone = v
    } else if (k === 'age') {
      setInputAge(v)
      obj.info.age = v
    }
  }
  const spanNameRef = React.useRef(null)
  const spanIponeRef = React.useRef(null)
  const spanAgeRef = React.useRef(null)
  return (
    <div className="flex flex-col">
      <span className="w-full rounded bg-blue-500 p-2" ref={spanNameRef}>
        {obj.name}
      </span>
      <input
        className="flex-1 rounded border bg-blue-500 p-2"
        placeholder="输入名字"
        value={inputName}
        onChange={(e) => inputChange(e.target.value, 'name')}
      />
      <span className="w-full rounded bg-blue-500 p-2" ref={spanIponeRef}>
        {obj.info.iphone}
      </span>
      <input
        className="flex-1 rounded border bg-blue-500 p-2"
        placeholder="输入电话"
        value={inputIphone}
        onChange={(e) => inputChange(e.target.value, 'iphone')}
      />
      <span className="w-full rounded bg-blue-500 p-2" ref={spanAgeRef}>
        {obj.info.age}
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
```

<DefinePropertyComp />

## Vue 类

通过**数据劫持 + 发布订阅模式**实现 Vue 类

export const VueComp = () => {
  class Vue {
    constructor(obj_instance) {
      this.$data = obj_instance.data
      Observer(this.$data)
      Compile(obj_instance.el, this)
    }
  }
  // 数据劫持
  function Observer(data_instance) {
    if (!data_instance || typeof data_instance !== 'object') return
    const dependency = new Dependency()
    for (const key in data_instance) {
      let value = data_instance[key]
      Observer(value)
      Object.defineProperty(data_instance, key, {
        enumerable: true,
        configurable: true,
        get() {
          Dependency.temp && dependency.addSub(Dependency.temp)
          return value
        },
        set(newValue) {
          if (value === newValue) return
          value = newValue
          Observer(newValue)
          dependency.notify()
        }
      })
    }
  }
  // HTML模板解析
  function Compile(element, vm) {
    vm.$el = document.querySelector(element)
    const fragment = document.createDocumentFragment()
    let child
    while ((child = vm.$el.firstChild)) {
      fragment.append(child)
    }
    fragment_compile(fragment)
    // 替换文档碎片内容
    function fragment_compile(node) {
      const xxx = node.nodeValue
      const pattern = /\(\(\s*(\S+)\s*\)\)/
      if (node.nodeType === 3) {
        const result_regex = pattern.exec(node.nodeValue)
        if (result_regex) {
          const arr = result_regex[1].split('.')
          const value = arr.reduce((total, current) => total[current], vm.$data)
          node.nodeValue = xxx.replace(pattern, value)
          // 创建订阅者
          new Watcher(vm, result_regex[1], (newValue) => {
            node.nodeValue = xxx.replace(pattern, newValue)
          })
        }
        return
      }
      if (node.nodeType === 1 && node.nodeName === 'INPUT') {
        const attr = Array.from(node.attributes)
        attr.forEach((i) => {
          if (i.nodeName === 'v-model') {
            const value = i.nodeValue.split('.').reduce((total, current) => total[current], vm.$data)
            node.value = value
            // 创建订阅者
            new Watcher(vm, i.nodeValue, (newValue) => {
              node.value = newValue
            })
            // 添加监听
            node.addEventListener('input', (e) => {
              const arr1 = i.nodeValue.split('.')
              const arr2 = arr1.slice(0, arr1.length - 1)
              const final = arr2.reduce((total, current) => total[current], vm.$data)
              final[arr1[arr1.length - 1]] = e.target.value
            })
          }
        })
      }
      node.childNodes.forEach((child) => fragment_compile(child))
    }
    vm.$el.appendChild(fragment)
  }
  // 依赖 - 收集和通知订阅者
  class Dependency {
    constructor() {
      this.subscribers = []
    }
    addSub(sub) {
      this.subscribers.push(sub)
    }
    notify() {
      this.subscribers.forEach((sub) => sub.update())
    }
  }
  // 订阅者
  class Watcher {
    constructor(vm, key, callback) {
      this.vm = vm
      this.key = key
      this.callback = callback
      // 临时属性 - 触发getter
      Dependency.temp = this
      key.split('.').reduce((total, current) => total[current], vm.$data)
      Dependency.temp = null
    }
    update() {
      const value = this.key.split('.').reduce((total, current) => total[current], this.vm.$data)
      this.callback(value)
    }
  }
  React.useEffect(() => {
    new Vue({
      el: '#app',
      data: {
        name: 'liwenkai',
        info: {
          iphone: 12138,
          age: 18
        }
      }
    })
  }, [])
  return (
    <div id="app" className="flex flex-col">
      <span className="w-full rounded bg-blue-500 p-2">名字：((name))</span>
      <input className="flex-1 rounded border bg-blue-500 p-2" placeholder="输入名字" v-model="name" />
      <span className="w-full rounded bg-blue-500 p-2">电话：((info.iphone))</span>
      <input className="flex-1 rounded border bg-blue-500 p-2" placeholder="输入电话" v-model="info.iphone" />
      <span className="w-full rounded bg-blue-500 p-2">年龄：((info.age))</span>
      <input className="flex-1 rounded border bg-blue-500 p-2" placeholder="输入年龄" v-model="info.age" />
    </div>
  )
}

```tsx
export const VueComp = () => {
  class Vue {
    constructor(obj_instance) {
      this.$data = obj_instance.data
      Observer(this.$data)
      Compile(obj_instance.el, this)
    }
  }
  // 数据劫持
  function Observer(data_instance) {
    if (!data_instance || typeof data_instance !== 'object') return
    const dependency = new Dependency()
    for (const key in data_instance) {
      let value = data_instance[key]
      Observer(value)
      Object.defineProperty(data_instance, key, {
        enumerable: true,
        configurable: true,
        get() {
          Dependency.temp && dependency.addSub(Dependency.temp)
          return value
        },
        set(newValue) {
          if (value === newValue) return
          value = newValue
          Observer(newValue)
          dependency.notify()
        }
      })
    }
  }
  // HTML模板解析
  function Compile(element, vm) {
    vm.$el = document.querySelector(element)
    const fragment = document.createDocumentFragment()
    let child
    while ((child = vm.$el.firstChild)) {
      fragment.append(child)
    }
    fragment_compile(fragment)
    // 替换文档碎片内容
    function fragment_compile(node) {
      const xxx = node.nodeValue
      const pattern = /\(\(\s*(\S+)\s*\)\)/
      if (node.nodeType === 3) {
        const result_regex = pattern.exec(node.nodeValue)
        if (result_regex) {
          const arr = result_regex[1].split('.')
          const value = arr.reduce((total, current) => total[current], vm.$data)
          node.nodeValue = xxx.replace(pattern, value)
          // 创建订阅者
          new Watcher(vm, result_regex[1], (newValue) => {
            node.nodeValue = xxx.replace(pattern, newValue)
          })
        }
        return
      }
      if (node.nodeType === 1 && node.nodeName === 'INPUT') {
        const attr = Array.from(node.attributes)
        attr.forEach((i) => {
          if (i.nodeName === 'v-model') {
            const value = i.nodeValue.split('.').reduce((total, current) => total[current], vm.$data)
            node.value = value
            // 创建订阅者
            new Watcher(vm, i.nodeValue, (newValue) => {
              node.value = newValue
            })
            // 添加监听
            node.addEventListener('input', (e) => {
              const arr1 = i.nodeValue.split('.')
              const arr2 = arr1.slice(0, arr1.length - 1)
              const final = arr2.reduce((total, current) => total[current], vm.$data)
              final[arr1[arr1.length - 1]] = e.target.value
            })
          }
        })
      }
      node.childNodes.forEach((child) => fragment_compile(child))
    }
    vm.$el.appendChild(fragment)
  }
  // 依赖 - 收集和通知订阅者
  class Dependency {
    constructor() {
      this.subscribers = []
    }
    addSub(sub) {
      this.subscribers.push(sub)
    }
    notify() {
      this.subscribers.forEach((sub) => sub.update())
    }
  }
  // 订阅者
  class Watcher {
    constructor(vm, key, callback) {
      this.vm = vm
      this.key = key
      this.callback = callback
      // 临时属性 - 触发getter
      Dependency.temp = this
      key.split('.').reduce((total, current) => total[current], vm.$data)
      Dependency.temp = null
    }
    update() {
      const value = this.key.split('.').reduce((total, current) => total[current], this.vm.$data)
      this.callback(value)
    }
  }
  React.useEffect(() => {
    new Vue({
      el: '#app',
      data: {
        name: 'liwenkai',
        info: {
          iphone: 12138,
          age: 18
        }
      }
    })
  }, [])
  return (
    <div id="app" className="flex flex-col">
      <span className="w-full rounded bg-blue-500 p-2">名字：((name))</span>
      <input className="flex-1 rounded border bg-blue-500 p-2" placeholder="输入名字" v-model="name" />
      <span className="w-full rounded bg-blue-500 p-2">电话：((info.iphone))</span>
      <input className="flex-1 rounded border bg-blue-500 p-2" placeholder="输入电话" v-model="info.iphone" />
      <span className="w-full rounded bg-blue-500 p-2">年龄：((info.age))</span>
      <input className="flex-1 rounded border bg-blue-500 p-2" placeholder="输入年龄" v-model="info.age" />
    </div>
  )
}
```

<VueComp />
