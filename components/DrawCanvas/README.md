## 更新时间
20250731

## 简介
Canvas 绘制海报组件，支持绘制文本、图片、盒子、边框等元素，可用于生成海报图片并保存到相册

```html
<DrawCanvas ref="drawCanvasRef" :width="750" :height="1334" />
```

```js
import { ref } from 'vue'
import DrawCanvas from './DrawCanvas/index.vue';
const drawCanvasRef = ref(null)
function createPoster() {
  // 网络图片
  const bgEl = {
    type: 'image',
    url: 'https://file-recycle-test.kuarke.com/data/product/1/20250716181614/detail/20250716181614280_62443.png',
    left: 0,
    top: 0,
    width: 470,
    height: 690
  }
  // 矩形
  const whiteBgEl = {
    type: 'block',
    color: '#fff',
    radius: 30, // 30px圆角
    left: 'center',
    top: 275,
    width: 245,
    height: 245
  }
  // 文字
  const titelEl = {
    type: 'text',
    content: '长按扫码',
    color: '#333',
    fontSize: 20,
    left: 'center',
    top: 240
  }
  // 本地图片
  const mpCodeEl = {
    type: 'image',
    // #ifdef MP-ALIPAY
    url: 'static/camera.png',
    // #endif
    // #ifndef MP-ALIPAY
    url: '/static/camera.png',
    // #endif
    left: 'center',
    top: titelEl.top + titelEl.fontSize + 50,
    width: 180,
    height: 180
  }
  // 配置项
  const options = [
    bgEl, 
    whiteBgEl, 
    titelEl, 
    mpCodeEl,
  ]
  // 调用drawCanvasRef的onDraw方法，绘制并保存
  drawCanvasRef.value.onDraw(options, (url) => {
    console.log(url)
  })
}
```

## 平台与兼容性
微信小程序、支付宝小程序

## 技术栈
vue3
uniapp

## 库依赖
无

