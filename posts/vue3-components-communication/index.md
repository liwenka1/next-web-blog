---
title: vue3组件通信
date: 2023-04-21
tags: ['组件通信', 'Vue3']
description: 将vue3中常用的组件通信进行了总结
---

### vue3 组件通信

#### 汇总

---

- props
- emit
- v-model
- provide/inject
- eventBus(vue3 已经删除)
- vuex/pinia(状态管理工具)

---

#### props

通常用于父传子

```vue
// parent.vue
<template>
    <child :data="data"></child>
</template>
<script setup>
import { reactive } from "vue"
import child from "./child.vue"

const data = reactive(['一号伞兵','二号伞兵'])
<script>

// child.vue
<template>
    <span v-for = 'item in props.data'>{{item}}</span>
</template>
<script setup>
  const props = defineProps({
        data:{
            type:[] as any,
            default:[]
        }
    })
<script>
```

#### emit

```vue
// child.vue
<template>
    <button @click="handleClick">按钮</buttom>
</template>
<script setup>
    const emit = defineEmits(["myClick"])
    const handleClick = ()=>{
        emit("myClick", "这是发送给父组件的信息")
    }
</script>

// Parent.vue
<template>
    <child @myClick="onMyClick"></child>
</template>
<script setup>
    import child from "./child.vue"
    const onMyClick = (msg) => {
        console.log(msg) // 这是父组件收到的信息
    }
</script>
```

#### v-model

```vue
// child.vue
<template>
    <button @click="handleClick">按钮</buttom>
</template>
<script setup>
    const props = defineProps({
    list: {
        type: [] as any,
        default:[]
    },
    });
    const emits = defineEmits(["update:list"]);
    const handleClick = ()=>{
        const list = props.list;
        list.push("伞兵二号");
        emits("update:list", list);
    }
</script>

// Parent.vue
<template>
    <span v-for="item in list">{{ item }}</span>
    <child v-model:list="list" ></child>
</template>
<script setup>
    import child from "./child.vue"
    const list = reactive(["伞兵一号"])
</script>
```

#### provide/inject

```vue
// parent.vue
<template>
    <child></child>
</template>
<script setup>
import { ref, provide } from "vue";
const name = ref("provide");
provide("child", name.value);
<script>

// child.vue
<template>
    <span>{{child}}</span>
</template>
<script setup>
    import { inject } from "vue";
    const name = inject("child");
<script>
```
