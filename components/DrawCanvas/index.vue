<template>
  <canvas class="myCanvas" id="myCanvas" type="2d" />
</template>

<script setup>
import { getCurrentInstance } from 'vue'
import { createPoster2D } from './handleCanvas.js'

const { proxy } = getCurrentInstance()
const props = defineProps({
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  }
})


// 导出方法给父组件用
defineExpose({
  onDraw(options, callback) {
    createPoster2D.call(
      // 当前上下文
      proxy,
      // canvas相关信息
      {
        id: 'myCanvas',
        width: props.width,
        height: props.height
      },
      // 元素集合
      options,
      // 回调函数
      callback
    )
  },
})
</script>

<style lang="scss" scoped>
// 隐藏canvas
.myCanvas {
  // left: -9999px;
  // bottom: -9999px;
  top: 0;
  position: fixed;
  // canvas宽度
  width: calc(1px * v-bind(width));
  // canvas高度
  height: calc(1px * v-bind(height));
}
</style>
