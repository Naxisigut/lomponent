## 简介
预约上门时间组件，仿顺丰。

```html
<appoint-picker 
  v-model="bestTimeRange"
  v-model:show="showTimer"
></appoint-picker>
```

```js
import appointPicker from '@/components/appointPicker/appointPicker.vue'
const showTimer = ref(false)
const bestTimeRange = ref({})

// 打开预约弹窗
showTimer.value = true
```

## 平台与兼容性
Uniapp 支付宝小程序

## 技术栈
vue3

## 库依赖
uview-plus
`https://uview-plus.jiangruyi.com/components/install.html#google_vignette`

