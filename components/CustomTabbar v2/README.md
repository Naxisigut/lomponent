## 简介
自定义Tabbar。

文件夹中的`uu-tabbar`组件是从`vk-uview-ui`(支持vue2和vue3)组件库中的Tabbar组件复制、修改,且在原先的CustomTabbar之上修改而来。

CustomTabbar和CustomTabbar v2的区别主要在：
- 前者在注释中保留了原代码
- 前者中间为凸起按钮；后者无凸起
- 后者改变了底部安全区的代码，增加了click tab的面积
- 部分样式改变

```js
// main.js
import CustomTabbar from '@/components/CustomTabbar/index.vue';
app.component("RecycleMpTabbar", CustomTabbar)

```

```html
<CustomTabbar></CustomTabbar>
```

## 平台与兼容性
Uniapp 支付宝小程序 微信小程序

## 技术栈
vue3

## 库依赖

