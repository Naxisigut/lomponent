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
    // iconPath: "https://file-recycle.kuarke.com/data/product/1/20250520102106/20250520102106095_19183.png",
    // selectedIconPath: "https://file-recycle.kuarke.com/data/product/1/20250520102106/20250520102106095_19183.png",
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

  /* 自定义中间按钮操作 */
  // uni.chooseImage({
  //   count: 1,
  //   sizeType: ['compressed'],
  //   extension: ['jpg', 'png', 'jpeg'],
  //   success: (res) => {
  //     console.log(res, 'res')
  //     const tempFile = res.tempFiles[0]
  //     if(tempFile) {
  //       uni.setStorageSync('AiImage', tempFile)
  //       uni.navigateTo({
  //         url: '/packageA/pages/estimateBegin/estimateBegin?from=midButton'
  //       })
  //     }
  //   },
  //   fail: () => {
  //     console.log('上传图片失败');
  //   }
  // })


}
</script>

<style lang='scss' scoped>

</style>
