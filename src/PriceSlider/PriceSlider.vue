<template>
  <view v-if="filteredPrice" class="price-slider" :style="{ width: props.width }" @click="handleClick">
    <view class="value-wrapper">
      <view>￥{{ showValue }}</view>
    </view>
    <view class="grade-wrapper normal-wrapper">
      <view class="left">一般</view>
      <view class="middle" :style="{left: leftOfMidItem}">优秀</view>
      <view class="right">全新</view>
    </view>
    <view class="slider-wrapper" >
      <up-slider 
        v-model="sliderValue" 
        height="24rpx"
        class="slider-cpnt"
        :style="{width: sliderWidth}"
        :min="filteredPrice.minPrice"
        :max="filteredPrice.maxPrice || filteredPrice.middlePrice"
        >
        <template #default>
          <image src="./slider-block.png" mode="widthFix" class="price-slider__image" style="width: 50rpx"></image>
        </template>
      </up-slider>
      <view class="slider-rest"></view>
    </view>
    <view class="price-wrapper normal-wrapper">
      <view class="left">{{ filteredPrice.minPrice }}</view>
      <view class="middle" :style="{left: leftOfMidItem}">{{ filteredPrice.middlePrice }}</view>
      <view class="right">{{ filteredPrice.maxPrice }}</view>
    </view>
  </view>
  <view v-else-if="showNoPrice">
    <view class="no-price">暂无报价</view>
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import AccurateCal from './AccurateCal';
defineOptions({
  name: 'PriceSlider'
})
const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  price: {
    type: Object,
    required: true
  },
  showNoPrice: {
    type: Boolean,
    default: false
  }
})
const handleClick = () => {
  console.log('slider click', props.price, filteredPrice.value);
}
const filteredPrice = computed(() => {
  if(!props.price.minPrice || !props.price.middlePrice){
    return null
  }
  return {
    minPrice: AccurateCal.div(Number(props.price.minPrice), 100),
    middlePrice: AccurateCal.div(Number(props.price.middlePrice), 100),
    maxPrice: props.price.maxPrice ? AccurateCal.div(Number(props.price.maxPrice), 100) : ''
  }
})
const total = computed(() => {
  if(!filteredPrice.value)return 0
  const { minPrice, middlePrice, maxPrice } = filteredPrice.value
  const total = (maxPrice || middlePrice) - minPrice
  return total
})

const sliderWidth = computed(() => {
  if(filteredPrice.value && filteredPrice.value.maxPrice){
    return '100%'
  }else{
    return '75%'
  }
})
const leftOfMidItem = computed(() => {
  if(filteredPrice.value && filteredPrice.value.maxPrice){
    if(!total.value || isNaN(total.value))return '50%'
    const middleOneLeft = (filteredPrice.value.middlePrice - filteredPrice.value.minPrice) / total.value
    return `${middleOneLeft.toFixed(2) * 100}%`
  }else{
    return '75%'
  }
})
const sliderValue = ref(filteredPrice.value ? filteredPrice.value.middlePrice : 50)
const showValue = computed(() => {
  return sliderValue.value
})

// 点击slider时sliderValue会变化，且极易出现NaN，所以需要监听sliderValue的变化
watch(sliderValue, (newVal, oldVal) => {
  if(isNaN(newVal)){
    sliderValue.value = oldVal
  }
})
// Props.price => filteredPrice => sliderValue, 相当于重新加载
watch(filteredPrice, (newVal, oldVal) => {
  if(!newVal)return
  sliderValue.value = newVal.middlePrice
})
</script>

<style lang='scss' scoped>
.price-slider{
  .value-wrapper{
    font-size: 56rpx;
    line-height: 1;
    color: #202E3D;
    text-align: center;
    font-weight: bold;
    margin-bottom: 40rpx;
  }
  .normal-wrapper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    font-size: 24rpx;
    line-height: 28rpx;
    &.grade-wrapper{
      color: #000000;
    }
    &.price-wrapper{
      color: #707485;
    }
    .middle{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .slider-wrapper{
    display: flex;
    align-items: center;

  }
  .slider-rest{
    flex: 1;
    background: #999999;
    height: 24rpx;
  }
}

.no-price{
  font-size: 56rpx;
  line-height: 1;
  color: #202E3D;
  text-align: center;
  font-weight: bold;
  margin-bottom: 40rpx;
}
</style>
