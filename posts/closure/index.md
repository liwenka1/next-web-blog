---
title: 闭包（closure）
date: 2024-04-01
description: 闭包（closure）是一个函数以及其捆绑的周边环境状态（lexical environment，词法环境）的引用的组合。换而言之，闭包让开发者可以从内部函数访问外部函数的作用域。在 JavaScript 中，闭包会随着函数的创建而被同时创建。
---

# 前言

在 MDN 中对于闭包的描述：

> 闭包（closure）是一个函数以及其捆绑的周边环境状态（lexical environment，词法环境）的引用的组合。换而言之，闭包让开发者可以从内部函数访问外部函数的作用域。在 JavaScript 中，闭包会随着函数的创建而被同时创建。

## 词法作用域

请看下面的例子：

export const InitComp = () => {
  const init = () => {
    const name = 'liwenkai'
    const displayName = () => {
      alert(name)
    }
    displayName()
  }
  return (
    <button className="rounded bg-blue-500 p-2" onClick={init}>
      点我
    </button>
  )
}

```tsx
export const InitComp = () => {
  const init = () => {
    const name = 'liwenkai'
    const displayName = () => {
      alert(name)
    }
    displayName()
  }
  return (
    <button className="rounded bg-blue-500 p-2" onClick={init}>
      点我
    </button>
  )
}
```

<InitComp />

> init() 创建了一个局部变量 name 和一个名为 displayName() 的函数。displayName() 是定义在 init() 里的内部函数，并且仅在 init() 函数体内可用。请注意，displayName() 没有自己的局部变量。然而，因为它可以访问到外部函数的变量，所以 displayName() 可以使用父函数 init() 中声明的变量 name 。

## 闭包

现在来看这个例子：

export const MakeFuncComp = () => {
  const makeFunc = () => {
    const name = 'liwenkai'
    const displayName = () => {
      alert(name)
    }
    return displayName
  }
  const myFunc = makeFunc()
  return (
    <button className="rounded bg-blue-500 p-2" onClick={myFunc}>
      点我
    </button>
  )
}

```tsx
export const MakeFuncComp = () => {
  const makeFunc = () => {
    const name = 'liwenkai'
    const displayName = () => {
      alert(name)
    }
    return displayName
  }
  const myFunc = makeFunc()
  return (
    <button className="rounded bg-blue-500 p-2" onClick={myFunc}>
      点我
    </button>
  )
}
```

<MakeFuncComp />

> 运行这段代码的效果和之前 init() 函数的示例完全一样。其中不同的地方（也是有意思的地方）在于内部函数 displayName() 在执行前，从外部函数返回。

> 第一眼看上去，也许不能直观地看出这段代码能够正常运行。在一些编程语言中，一个函数中的局部变量仅存在于此函数的执行期间。一旦 makeFunc() 执行完毕，你可能会认为 name 变量将不能再被访问。然而，因为代码仍按预期运行，所以在 JavaScript 中情况显然与此不同。

> 原因在于，JavaScript 中的函数会形成了闭包。 闭包是由函数以及声明该函数的词法环境组合而成的。该环境包含了这个闭包创建时作用域内的任何局部变量。在本例子中，myFunc 是执行 makeFunc 时创建的 displayName 函数实例的引用。displayName 的实例维持了一个对它的词法环境（变量 name 存在于其中）的引用。因此，当 myFunc 被调用时，变量 name 仍然可用，其值 Mozilla 就被传递到alert中。

下面是一个更有意思的示例 — 一个 makeAdder 函数：

export const MakeAdderComp = () => {
  const makeAdder = (x) => {
    return function (y) {
      return x + y
    }
  }
  const add5 = makeAdder(5)
  const add10 = makeAdder(10)
  const [number, setNumber] = React.useState(0)
  return (
    <div className="flex gap-4">
      <button className="rounded bg-blue-500 p-2" onClick={() => setNumber(add5(number))}>
        点我+5
      </button>
      <button className="rounded bg-blue-500 p-2" onClick={() => setNumber(add10(number))}>
        点我+10
      </button>
      <button className="rounded bg-blue-500 p-2" onClick={() => setNumber(0)}>
        重置为0
      </button>
      <span className="w-20 rounded bg-blue-500 p-2">{number}</span>
    </div>
  )
}

```tsx
export const MakeAdderComp = () => {
  const makeAdder = (x) => {
    return function (y) {
      return x + y
    }
  }
  const add5 = makeAdder(5)
  const add10 = makeAdder(10)
  const [number, setNumber] = React.useState(0)
  return (
    <div className="flex gap-4">
      <button className="rounded bg-blue-500 p-2" onClick={() => setNumber(add5(number))}>
        点我+5
      </button>
      <button className="rounded bg-blue-500 p-2" onClick={() => setNumber(add10(number))}>
        点我+10
      </button>
      <button className="rounded bg-blue-500 p-2" onClick={() => setNumber(0)}>
        重置为0
      </button>
      <span className="w-20 rounded bg-blue-500 p-2">{number}</span>
    </div>
  )
}
```

<MakeAdderComp />

## 实用的闭包

> 闭包很有用，因为它允许将函数与其所操作的某些数据（环境）关联起来。这显然类似于面向对象编程。在面向对象编程中，对象允许我们将某些数据（对象的属性）与一个或者多个方法相关联。

> 因此，通常你使用只有一个方法的对象的地方，都可以使用闭包。

> 在 Web 中，你想要这样做的情况特别常见。大部分我们所写的 JavaScript 代码都是基于事件的 — 定义某种行为，然后将其添加到用户触发的事件之上（比如点击或者按键）。我们的代码通常作为回调：为响应事件而执行的函数。

接着看下面一个利用闭包来改变字号的例子：

export const MakeSizerComp = () => {
  const makesize = (size) => {
    return function () {
      return 'text-' + size
    }
  }
  const [spanClass, setSpanClass] = React.useState('text-base')
  return (
    <>
      <div className="flex h-20 items-center">
        <span className={spanClass}>Some paragraph text</span>
      </div>
      <div className="flex gap-4">
        <button className="rounded bg-blue-500 p-2" onClick={() => setSpanClass(makesize('sm'))}>
          点我 sm
        </button>
        <button className="rounded bg-blue-500 p-2" onClick={() => setSpanClass(makesize('base'))}>
          点我 base
        </button>
        <button className="rounded bg-blue-500 p-2" onClick={() => setSpanClass(makesize('2xl'))}>
          点我 2xl
        </button>
      </div>
    </>
  )
}

```tsx
export const MakeSizerComp = () => {
  const makesize = (size) => {
    return function () {
      return 'text-' + size
    }
  }
  const [spanClass, setSpanClass] = React.useState('text-base')
  return (
    <>
      <div className="flex h-20 items-center">
        <span className={spanClass}>Some paragraph text</span>
      </div>
      <div className="flex gap-4">
        <button className="rounded bg-blue-500 p-2" onClick={() => setSpanClass(makesize('sm'))}>
          点我 sm
        </button>
        <button className="rounded bg-blue-500 p-2" onClick={() => setSpanClass(makesize('base'))}>
          点我 base
        </button>
        <button className="rounded bg-blue-500 p-2" onClick={() => setSpanClass(makesize('2xl'))}>
          点我 2xl
        </button>
      </div>
    </>
  )
}
```

<MakeSizerComp />

## 用闭包模拟私有方法

> 编程语言中，比如 Java，是支持将方法声明为私有的，即它们只能被同一个类中的其他方法所调用。

> 而 JavaScript 没有这种原生支持，但我们可以使用闭包来模拟私有方法。私有方法不仅仅有利于限制对代码的访问：还提供了管理全局命名空间的强大能力，避免非核心的方法弄乱了代码的公共接口部分。

export const CounterComp = () => {
  const Counter = () => {
    let privateCounter = 0
    const changeBy = (val) => {
      privateCounter += val
    }
    return {
      increment: () => changeBy(1),
      decrement: () => changeBy(-1),
      reset: () => {
        privateCounter = 0
      },
      value: () => {
        return privateCounter
      }
    }
  }
  const myCounter = React.useMemo(() => Counter(), [])
  const [count, setCount] = React.useState(myCounter.value())
  return (
    <>
      <div className="flex h-20 items-center">
        <span className="w-20 rounded bg-blue-500 p-2">{count}</span>
      </div>
      <div className="flex gap-4">
        <button
          className="rounded bg-blue-500 p-2"
          onClick={() => {
            myCounter.increment()
            setCount(myCounter.value())
          }}
        >
          点我+1
        </button>
        <button
          className="rounded bg-blue-500 p-2"
          onClick={() => {
            myCounter.decrement()
            setCount(myCounter.value())
          }}
        >
          点我-1
        </button>
        <button
          className="rounded bg-blue-500 p-2"
          onClick={() => {
            myCounter.reset()
            setCount(myCounter.value())
          }}
        >
          重置为0
        </button>
      </div>
    </>
  )
}

```tsx
export const CounterComp = () => {
  const Counter = () => {
    let privateCounter = 0
    const changeBy = (val) => {
      privateCounter += val
    }
    return {
      increment: () => changeBy(1),
      decrement: () => changeBy(-1),
      reset: () => {
        privateCounter = 0
      },
      value: () => {
        return privateCounter
      }
    }
  }
  const myCounter = React.useMemo(() => Counter(), [])
  const [count, setCount] = React.useState(myCounter.value())
  return (
    <>
      <div className="flex h-20 items-center">
        <span className="w-20 rounded bg-blue-500 p-2">{count}</span>
      </div>
      <div className="flex gap-4">
        <button
          className="rounded bg-blue-500 p-2"
          onClick={() => {
            myCounter.increment()
            setCount(myCounter.value())
          }}
        >
          点我+1
        </button>
        <button
          className="rounded bg-blue-500 p-2"
          onClick={() => {
            myCounter.decrement()
            setCount(myCounter.value())
          }}
        >
          点我-1
        </button>
        <button
          className="rounded bg-blue-500 p-2"
          onClick={() => {
            myCounter.reset()
            setCount(myCounter.value())
          }}
        >
          重置为0
        </button>
      </div>
    </>
  )
}
```

<CounterComp />
