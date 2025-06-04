## 简介
自定义导航栏。
在页面下拉时(onPageScroll)调用onScrollThrottle可实现下拉透明渐变。
```vue
const navbars = reactive({
  title: '商品详情',
})
const navbarRef = ref(null)
onPageScroll((e) => {
  navbarRef.value?.onScrollThrottle(e)
})

```

## 平台与兼容性
Uniapp 支付宝小程序

## 技术栈
vue3

## 库依赖
uview-plus
`https://uview-plus.jiangruyi.com/components/install.html#google_vignette`

