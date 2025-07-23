<template>
	<view v-if="show" class="u-tabbar custom-tabbar" @touchmove.stop.prevent="() => {}">
    <!-- 自定义tabbar布局 -->
    <view class="custom-tabbar__content">
      <view v-for="(item, index) in list" :key="index" class="custom-tabbar__content__item" :class="{ 'mid': item.midButton }" @tap.stop="clickHandler(index)">
        <view v-if="item.midButton" class="custom-tabbar__content__item__mid">
          <view class="mid-placeholder" v-if="!showMid"></view>
          <image src="/static/tabbar/mid.png" mode="widthFix" @load="onMidLoad":class="{ 'show': showMid }" />
        </view>
        <view v-else class="custom-tabbar__content__item__normal">
          <view :style="{minHeight: iconSize}">
            <image :src="elIconPath(index)" mode="heightFix" :style="{height: iconSize}" />
          </view>
          <text class="custom-tabbar__content__item__normal__text" :style="{ color: elColor(index) }">{{ item.text }}</text>
        </view>
      </view>
    </view>
		<view class="custom-tabbar--fixed-placeholder" :style="{ height: bottomSafeHeight }">
      <view @tap.stop="clickHandler(0)" />
      <view @tap.stop="clickHandler(1)" class="mid" />
      <view @tap.stop="clickHandler(2)" />
    </view>
	</view>
</template>

<script>
import { getBottomSafeHeight } from '@/utils/condition.js'
export default {
	emits: ["update:modelValue", "input", "change", "mid"],
	props: {
		// 通过v-model绑定current值
		value: {
			type: [String, Number],
			default: 0
		},
		modelValue: {
			type: [String, Number],
			default: 0
		},
		// 显示与否
		show: {
			type: Boolean,
			default: true
		},
		// 整个tabbar的背景颜色
		bgColor: {
			type: String,
			default: "#ffffff"
		},
		// tabbar的高度，默认50px，单位任意，如果为数值，则为rpx单位
		height: {
			type: [String, Number],
			default: "100rpx" //根据UI
		},
		// 非凸起图标的大小，单位任意，数值默认rpx
		iconSize: {
			type: [String, Number],
			default: '48rpx'
		},
		// 凸起的图标的大小，单位任意，数值默认rpx
		midButtonSize: {
			type: [String, Number],
			default: '104rpx' // icon大小根据设计图
		},
		// 激活时的演示，包括字体图标，提示文字等的演示
		activeColor: {
			type: String,
			default: "#ABFE4B"
		},
		// 未激活时的颜色
		inactiveColor: {
			type: String,
			default: "#DDDDE0"
		},
		// 是否显示中部的凸起按钮
		midButton: {
			type: Boolean,
			default: false
		},
		// 配置参数
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		// 切换前的回调
		beforeSwitch: {
			type: Function,
			default: null
		},
		// 是否显示顶部的横线
		borderTop: {
			type: Boolean,
			default: true
		},
		// 是否隐藏原生tabbar
		hideTabBar: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			// 由于安卓太菜了，通过css居中凸起按钮的外层元素有误差，故通过js计算将其居中
			midButtonLeft: "50%",
			pageUrl: "", // 当前页面URL
      showMid: false,
      bottomSafeHeight: getBottomSafeHeight() + 'px'
		};
	},
	created() {
		// 是否隐藏原生tabbar
		if (this.hideTabBar) uni.hideTabBar();
		// 获取引入了u-tabbar页面的路由地址，该地址没有路径前面的"/"
		let pages = getCurrentPages();
		if (pages.length > 0) {
			// 页面栈中的最后一个即为项为当前页面，route属性为页面路径
			this.pageUrl = pages[pages.length - 1].route;
		}
	},
	computed: {
		valueCom() {
			// #ifdef VUE2
			return this.value;
			// #endif

			// #ifdef VUE3
			return this.modelValue;
			// #endif
		},
		elIconPath() {
			return index => {
				// 历遍u-tabbar的每一项item时，判断是否传入了pagePath参数，如果传入了
				// 和data中的pageUrl参数对比，如果相等，即可判断当前的item对应当前的tabbar页面，设置高亮图标
				// 采用这个方法，可以无需使用v-model绑定的value值
				let pagePath = this.list[index].pagePath;
				// 如果定义了pagePath属性，意味着使用系统自带tabbar方案，否则使用一个页面用几个组件模拟tabbar页面的方案
				// 这两个方案对处理tabbar item的激活与否方式不一样
				if (pagePath) {
					if (pagePath == this.pageUrl || pagePath == "/" + this.pageUrl) {
						return this.list[index].selectedIconPath;
					} else {
						return this.list[index].iconPath;
					}
				} else {
					// 普通方案中，索引等于v-model值时，即为激活项
					return index == this.valueCom
						? this.list[index].selectedIconPath
						: this.list[index].iconPath;
				}
			};
		},
		elColor() {
			return index => {
				// 判断方法同理于elIconPath
				let pagePath = this.list[index].pagePath;
				if (pagePath) {
					if (pagePath == this.pageUrl || pagePath == "/" + this.pageUrl) return this.activeColor;
					else return this.inactiveColor;
				} else {
					return index == this.valueCom ? this.activeColor : this.inactiveColor;
				}
			};
		}
	},
	methods: {
		async clickHandler(index) {
      if(typeof this.beforeSwitch !== "function"){
        this.switchTab(index)
        return
      }
      
      let beforeSwitch = this.beforeSwitch(index); // beforeSwitch最好使用箭头函数，避免this指向问题
      if(beforeSwitch === true){
        this.switchTab(index)
        return
      }

      // 判断是否返回了promise
      if (!!beforeSwitch && typeof beforeSwitch.then === "function") {
        await beforeSwitch
          .then(res => {
            // promise返回成功，
            this.switchTab(index);
          })
          .catch(err => {});
      }
		},
		// 切换tab
		switchTab(index) {
			// 发出事件和修改v-model绑定的值
			this.$emit("change", index);

			// 如果有配置pagePath属性，使用uni.switchTab进行跳转
      const clickItem = this.list[index]
      clickItem.midButton && this.$emit("mid", clickItem)
			if (clickItem.pagePath) {
				uni.switchTab({
					url: clickItem.pagePath,
				});
			} else {
				// 如果配置了pagePath属性，将不会双向绑定v-model传入的value值
				// 因为这个模式下，不再需要v-model绑定的value值了，而是通过getCurrentPages()适配
				this.$emit("input", index);
				this.$emit("update:modelValue", index);
			}
		},
    onMidLoad(e) {
      this.showMid = true
      // console.log('onMidLoad', e);
    }
	}
};
</script>

<style scoped lang="scss">
.custom-tabbar{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 998;
  background: #ffffff;
  
  &__content{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 108rpx;
    background: #fff;
    box-shadow: inset 0rpx 2rpx 0rpx 0rpx #F0ECE5;
    /* #ifndef APP-NVUE */
		box-sizing: content-box;
		/* #endif */
    &__item{
      &:not(.mid){
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &__mid{
        overflow: hidden;
        image{
          display: none;
          width: 164rpx;
          &.show{
            display: block;
          }
        }
      }
      &__normal{
        display: flex;
        align-items: center;
        gap: 4rpx;
        flex-direction: column;
        &__text{
          font-size: 20rpx;
          line-height: 28rpx;
          font-weight: 300;
        }
      }
    }
  }
  &--fixed-placeholder{
    display: flex;
    &>view{
      height: 100%;
      &:not(.mid){
        flex: 1;
      }
      &.mid{
        width: 164rpx;
      }
    }
  }
}
</style>
