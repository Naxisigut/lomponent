<template>
  <UUTabbar :list="list" @change="change" @mid="onMid" v-bind="bindProps"></UUTabbar>
</template>

<script setup>
import UUTabbar from './uu-tabbar.vue'
import { reactive, getCurrentInstance } from 'vue'
defineOptions({
  name: 'RecycleMpTabbar'
})
const emit = defineEmits(['change', 'mid'])
const { proxy } = getCurrentInstance()
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

const beforeSwitch = (index) => {
  const eventName = index === 0
    ? "tab_home_click"
    : index === 1
    ? "tab_estimate_click"
    : index === 2
    ? "tab_my_click"
    : ""
  eventName && proxy.$sensors.track(eventName, {})
  return true
}
const change = (params) => emit('change', params)
const onMid = (params) => {
  emit('mid', params)
  uni.navigateTo({
    url: '/packageA/pages/photoChoose/photoChoose'
  })
}


const bindProps = reactive({
  activeColor: '#090C15',
  inactiveColor: '#9D9EA1',
  beforeSwitch,
})
</script>

<style lang='scss' scoped>

</style>
