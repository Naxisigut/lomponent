<template>
  <UUTabbar :list="list" @change="change" @mid="onMid"></UUTabbar>
</template>

<script setup lang='ts'>
import UUTabbar from './uu-tabbar.vue'
import { reactive } from 'vue'
defineOptions({
  name: 'CustomTabbar'
})
const emit = defineEmits(['change', 'mid'])

const list = reactive([
  {
    iconPath: "/static/tabbar/home.png",
    selectedIconPath: "/static/tabbar/home-active.png",
    text: '首页',
    customIcon: false,
    pagePath: '/pages/index/index'
  },
  {
    iconPath: "/static/tabbar/mid.png",
    selectedIconPath: "/static/tabbar/mid.png",
    text: 'AI估价',
    midButton: true,
    customIcon: false,
  },
  {
    iconPath: "/static/tabbar/my.png",
    selectedIconPath: "/static/tabbar/my-active.png",
    text: '我的',
    customIcon: false,  
    pagePath: '/pages/my/my'
  },
])

const change = (params) => emit('change', params)
const onMid = (params) => {
  emit('mid', params)
}
</script>

<style lang='scss' scoped>

</style>
