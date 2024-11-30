---
title: EventBus 类
date: 2024-04-16
description: 简单实现一个 EventBus 类，拥有 on、off 和 emit 三个方法
---

## 前言

## EventBus 类

export class EventBus {
  constructor() {
    this.msgList = {}
  }
  emit() {}
  on() {}
  off() {}
  once() {}
}

export const CompA = () => {
  return <div>compA</div>
}

export const CompB = () => {
  return <div>compB</div>
}

export const EventBusComp = () => {
  return (
    <>
      <CompA />
      <CompB />
    </>
  )
}

<EventBusComp />
