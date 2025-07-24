<template>
  <up-navbar v-bind="vBindProps" @leftClick="onLeftClick"/>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
const emit = defineEmits(['leftClick'])
const props = defineProps({
  navbar: {
    type: Object,
    default: () => ({
      title: "",
    })
  }
})
onMounted(() => {
  // #ifdef MP-ALIPAY
  // 设置左上角的icon为黑色
  my.setNavigationBar({
    frontColor: '#000000',
    backgroundColor: '#ffffff',
  })
  // #endif
})

const onLeftClick = () => {
  emit('leftClick')
}

const defaultProps = reactive({
  titleStyle: {
    fontSize: '32rpx',
    color: '#1E2234',
    fontWeight: '600'
  },
  placeholder: true,
  // #ifdef MP-ALIPAY
  leftIcon: "", // 支付宝小程序原生的返回按钮不可取消，故此处置空
  // #endif
  // #ifdef MP-WEIXIN
  leftIcon: 'arrow-left',
  autoBack: true,
  // #endif
  bgColor: 'transparent'
})
const vBindProps = computed(() => {
  return Object.assign(defaultProps, props.navbar)
})


function throttle(func, limit=2000) {
	let inThrottle;
	let lastArgs;
	return function(...args) {
		const context = this;
		lastArgs = args;
		if (!inThrottle) {
			// func.apply(context, args);
			inThrottle = true;
			setTimeout(() => {
				// 执行最后一次调用
				if (lastArgs) {
					func.apply(context, lastArgs);
					lastArgs = null;
				}
				inThrottle = false;
			}, limit);
		}
	}
}
let scrollFlag = false
const onScroll = (e) => {
  if((scrollFlag && e.scrollTop >= 50)) return
  if (e.scrollTop >= 50) {
    defaultProps.bgColor = '#ffffff'
    scrollFlag = true
  } else {
    // 计算透明度，从0到1线性增加
    const opacity = Math.max(0, Math.min(1, e.scrollTop / 50))
    defaultProps.bgColor = `rgba(255, 255, 255, ${opacity})`
    scrollFlag = false
  }
}
const onScrollThrottle = throttle(onScroll, 10)
defineExpose({
  onScrollThrottle
})
</script>

<style scoped></style>