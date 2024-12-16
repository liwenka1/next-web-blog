---
title: 三元表达式与条件判断
date: 2023-04-27
tags: ['编程规范', '三元表达式', 'if 语句']
description: 日常遇到的一个三元表达式相关问题
---

### 三元表达式

---

什么是三元表达式？

- 又叫三元运算符，必须有三个操作数参与的运算
- 操作符号：? :
- 属于条件判断语句

```
例如

me === "帅哥" ? "你说对了!" : "你什么眼神？"
```

- 这就是最简单的三元表达式，同时我们可以通过扩展进行连续判断

```
例如

me === "帅哥" ? "你说对了!" : you === "笨蛋" ? "肯定的" : "你什么眼神？"
```

- 但是如果我们一直链式判断下去是不合理的，会严重影响理解和阅读，对于后期的维护工作可以说是添加了一份耐人寻味的颜色
- 因此倘若我们要进行多次的连续判断在这里我依旧推荐大家使用可读性更高的 if 语句

---

### if 语句

---

什么是 if 语句?

- 使用 if 语句来规定假如条件为 true 时被执行的 JavaScript 代码块。

```
例如

if(me === "帅哥"){
    return "你说对了!"
}else {
    retrun "你什么眼神？"
}
```

- 尝试链式调用

```
if(me === "帅哥"){
    return "你说对了!"
}else {
    if(you === "笨蛋"){
    retrun "肯定的"
    }else {
    retrun "你什么眼神？"
    }
}
```

---

### 连续三元表达式重构

---

下面来对一个我日常遇到的 连续三元表达式 进行一下重构

#### 三元表达式

![image](/static/images/ternary-expression.png)

#### if 语句

```js
if (['yjs', 'lp', 'rgjs'].includes(obj.bidStatus)) {
  return '结束时间'
} else {
  if (obj.bidStatus === 'wks') {
    return ''
  } else {
    return '预计'
  }
}

if (['jpz'].includes(obj.bidStatus)) {
  return `${
    obj.endDate !== undefined
      ? obj.endDate.slice(0, obj.endDate.length - 3) || ''
      : ''
  }结束`
} else {
  if (['wks', 'zbz'].includes(obj.bidStatus)) {
    if (sourceFlag === 'litigation-asstts') {
      return `预计${
        obj.startDate !== undefined
          ? obj.startDate.slice(0, obj.endDate.length - 3)
          : ''
      }开始`
    }
  } else {
    if (['yjs'].includes(obj.bidStatus) && obj.endDate !== undefined) {
      return obj.endDate
    } else {
      return `${
        obj.startDate !== undefined
          ? obj.startDate.slice(0, obj.endDate.length - 3)
          : ''
      }`
    }
  }
}
```

---
