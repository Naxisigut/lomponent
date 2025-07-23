<template>
	<view 
		class="circle-checkbox" 
		:style="{ width: props.size, height: props.size }"
		@click.stop="handleClick"
	>
		<image :src="currentImage" class="checkbox-image"mode="aspectFit" />
	</view>
</template>

<script setup>
import { computed } from 'vue';
defineOptions({
	name: 'CircleCheckbox',
  virtualHost: true
})

// 定义v-model
const modelValue = defineModel({
	type: Boolean,
	default: false
});

// 定义其他props
const props = defineProps({
	// 图片尺寸大小
	size: {
		type: String,
		default: '28rpx'
	}
});

const currentImage = computed(() => {
	return modelValue.value 
		? '/static/circle-checked.png' 
		: '/static/circle-unchecked.png';
});

// 处理点击事件
const handleClick = () => {
	modelValue.value = !modelValue.value;
};
</script>

<style scoped>
.circle-checkbox {
	display: inline-block;
	cursor: pointer;
	line-height: 0;
}

.checkbox-image {
	display: block;
	width: 100%;
	height: 100%;
}
</style>
