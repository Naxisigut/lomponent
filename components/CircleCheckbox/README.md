## 简介
checkbox组件。
主要是在uniapp 小程序中自定义checkbox的样式太麻烦了，所以写了一个自定义的checkbox组件。
对外作为行内元素使用。可以传入尺寸大小。

```js
const agree = ref(false)

```

```html
<view class="agree-wrapper" @click.stop="agree = !agree" style="margin-bottom: 24rpx;">
  <CircleCheckbox v-model="agree" style="width: 28rpx;height: 28rpx;" />
  <text style="margin-left: 8rpx;">我已阅读并同意</text>
  <text @click.stop="goProtocol(1)">《回收服务协议》</text>
</view>
```

## 平台与兼容性
Uniapp 支付宝小程序 微信小程序

## 技术栈
vue3

## 库依赖

