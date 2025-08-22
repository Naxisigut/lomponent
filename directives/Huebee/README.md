## 简介
基于 Huebee 的取色器指令。为元素（建议为 `input`/`textarea`）绑定后，点击可弹出取色器，选择结果为十六进制颜色值，并自动触发 `input` 与 `change` 事件，方便配合 `v-model` 使用。

#### 相关链接
`https://huebee.buzz/`


#### 样式引入
```js
// main.js
import 'huebee/huebee.min.css'
```

#### 全局注册
```js
// main.js 全局注册（插件方式）
import HuebeePlugin from '/huebee/index.js'
Vue.use(HuebeePlugin)
```

#### 在组件中调用
```html
<!-- 常见用法：与 v-model 配合，实时拿到颜色值 -->
<input v-model="color" v-huebee placeholder="选择颜色" />
```

```js
export default {
  data () {
    return {
      color: '#ff0000'
    }
  }
}
```

- 指令会把选中的颜色写入到元素的 `value`，并触发 `input`/`change`，因此 `v-model` 会自动同步。
- 如未使用 `v-model`，也可手动监听 `@input` 或 `@change` 获取值。

#### 默认配置
当前实现内置默认参数：
- `notation: 'hex'` 输出十六进制颜色
- `saturations: 2` 饱和度档位为 2

> 若需扩展自定义配置，可在指令实现中读取 `binding.value` 并传入 `new Huebee(el, options)`。

## 平台与兼容性
web浏览器

## 技术栈
vue2 + huebee


