---
title: My First Post1
date: 2021-12-24
description: 闭包（closure）是一个函数1
---

Ullamco et nostrud magna commodo nostrud ...

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
