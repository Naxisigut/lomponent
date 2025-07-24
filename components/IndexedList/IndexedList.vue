<template>
  <view class="indexed-list">
    <view class="search-wrapper" id="TOP">
      <view class="search">
        <input @input="search" v-model="searchStr" :placeholder="placeholder" maxlength="50"
          placeholder-class="input-placeholder" />
        <view class="search-btn">搜索</view>
      </view>
    </view>
    <view class="scroll-bottom-wrapper">
      <scroll-view class="scroll-left" scroll-y :scroll-with-animation="true" :scroll-into-view="scrollIntoView" >
        <view class="left-list" v-for="(item,index) of scrollLeftObj" :key="index" :id="index!='#'?index:'BOTTOM'">
          <view class="left-item-top-holder" v-if="item && item.length"></view>
          <view class="left-item-title" v-if="item && item.length">{{index}}</view>
          <view class="left-item-title-line" v-if="item && item.length"></view>
          <view class="left-item-card" v-for="(mess,inx) in item" @click.stop="chooseItem(mess)">
            <template v-if="showAvatar" >
              <image :style="'border-radius:'+radius" class="left-item-card-img img-info" :src="mess[imgKey]"
                v-if="showAvatar && mess[imgKey]" @click.stop="preview(mess[imgKey])" />
              <view :style="'border-radius:'+radius" class="left-item-card-img" v-else>
                {{mess[nameKey] && mess[nameKey].slice(0,1) || ''}}
              </view>
            </template>
            <view class="left-item-card-info">
              <view class="left-item-card-name">{{mess[nameKey] || ''}}</view>
              <view class="left-item-card-phone" v-if="phoneKey && mess[phoneKey]">{{mess[phoneKey]}}</view>
            </view>
          </view>
        </view>
        <view class="no-data" v-if="!hasData">
          <image class="no-data-img" src="../../static/noData.png"></image>
          <view class="no-data-name">暂无数据</view>
        </view>
      </scroll-view>
      <view class="scroll-right" v-if="hasData">
        <view :class="{'scroll-right-name':true,'scroll-right-select':item==scrollIntoView}"
          v-for="(item,index) in scrollRightList" :key="index" @click.stop="chooseType(item)">{{item}}
        </view>
      </view>
    </view>
	</view>
</template>

<script>
	import {
		pinyinUtil
	} from './pinyinUtil.js';
	export default {
		props: {
			//数据源
			dataList: {
				type: Array,
				required: true,
				default: () => {
					return []
				}
			},
			//显示的主键key值
			idKey: {
				type: String,
				default: 'id'
			},
			//显示的名字key值
			nameKey: {
				type: String,
				default: 'name'
			},
			//显示的电话key值
			phoneKey: {
				type: String,
				default: 'phone'
			},
			//显示的头像key值
			imgKey: {
				type: String,
				default: ''
			},
			//头像圆角(rpx、px、%)
			radius: {
				type: String,
				default: '6rpx'
			},
			placeholder: {
				type: String,
				default: '请输入搜索信息'
			},
      showAvatar: {
        type: Boolean,
        default: false
      }
		},
		data() {
			return {
				searchStr: '',
				scrollIntoView: '',
				scrollLeftObj: {},
				oldObj: {},
				scrollRightList: [],
				hasData: true
			};
		},
		watch: {
			dataList: {
				immediate: true,
				deep: true,
				handler(newList) {
					if (newList && newList.length) this.cleanData(newList)
				},
			},
		},
		methods: {
			search() {
        if(this.scrollIntoView) this.scrollIntoView = ''
				if (this.searchStr) {
					let has = false
					this.scrollLeftObj = JSON.parse(JSON.stringify(this.oldObj))
					for (let i in this.scrollLeftObj) {
						this.scrollLeftObj[i] = this.scrollLeftObj[i].filter(item => {
							return (item[this.nameKey].indexOf(this.searchStr) != -1) || item[this.phoneKey]
								.indexOf(this.searchStr) != -1
						})
						if (this.scrollLeftObj[i].length) has = true
					}
					if (has) this.hasData = true
					else this.hasData = false
				} else {
					this.hasData = true
					this.scrollLeftObj = JSON.parse(JSON.stringify(this.oldObj))
				}
			},
			cleanData(list) {
				// this.scrollRightList = this.getLetter()
        const letterList = this.getLetter()
        const newLeftObj = {}
				let newList = []
				list.forEach(res => {
					let initial = pinyinUtil.getFirstLetter(res.name.trim())
					let firsfirs = initial ? initial.substring(0, 1) : ''
					if (!newList[firsfirs]) newList[firsfirs] = []
					newList[firsfirs].push({
						[this.idKey]: res[this.idKey] || '',
						[this.nameKey]: res[this.nameKey].trim() || '',
						[this.phoneKey]: res[this.phoneKey] || '',
						[this.imgKey]: res[this.imgKey] || ''
					})
				})
				letterList.forEach(t => {
					if (newList[t]) {
            newLeftObj[t] = newList[t]
					} else {
						// newLeftObj[t] = []
					}
				})
				let surplusList = []
				for (var i in newList) {
					let han = letterList.find(v => v == i)
					if (!han) surplusList.push(newList[i])
				}
				surplusList.forEach(item => {
          if (!newLeftObj['#']) newLeftObj['#'] = []
					newLeftObj['#'] = newLeftObj['#'].concat(item)
				})
        this.scrollLeftObj = newLeftObj
				this.oldObj = JSON.parse(JSON.stringify(this.scrollLeftObj))
        const newRightList = []
        letterList.forEach(t => { // 按照letterList的顺序对newRightList进行排序
          if(newLeftObj[t]) newRightList.push(t)
        })
        this.scrollRightList = newRightList
        // console.log('scrollLeftObj', this.scrollLeftObj);
			},
			getLetter() {
				let list = []
				for (var i = 0; i < 26; i++) {
					list.push(String.fromCharCode(65 + i))
				}
				list.push('#')
        // console.log('right letter list', list);
				return list
			},
			chooseType(item) {
				if (item == '#') item = 'BOTTOM'
				this.scrollIntoView = item
			},
			preview(img) {
				uni.previewImage({
					current: 0,
					urls: [img]
				})
			},
			chooseItem(item) {
				this.$emit('click', item)
			}
		},
	};
</script>
<style>
	/* /deep/ ::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
		display: none;
	} */
</style>
<style lang="scss" scoped>
.indexed-list {
  width: 100%;
  box-sizing: border-box;
  font-weight: 300;
  .search-wrapper{
    padding: 0 32rpx;
    .search {
      padding: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2rpx solid #242424;
      border-radius: 8rpx;
      input {
        flex: 1;
        height: 72rpx;
        border-radius: 8rpx;
        color: #333333;
      }
      .search-btn{
        width: 116rpx;
        height: 72rpx;
        background: #090C15;
        border-radius: 8rpx;
        color: #FFFFFF;
        font-size: 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .input-placeholder {
        color: #777777;
        font-size: 28rpx;
      }
    }
  }

  .scroll-left {
    height: 75vh;
    overscroll-behavior-y: none; // 禁用滚动回弹 滚动到顶部底部后不会影响到页面滚动

    .left-list {
      height: auto;
      padding: 0 32rpx;
      display: flex;
      flex-direction: column;
      gap: 30rpx;
      .left-item-title {
        font-size: 28rpx;
        line-height: 40rpx;
        color: #090C15;
        font-weight: 400;
      }
      .left-item-title-line{
        width: calc(100% - 40rpx);
        height: 2rpx;
        background: #F0F0F0;
      }

      .left-item-card {
        width: 100%;
        background-color: #FFFFFF;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .left-item-card-img {
          width: 80rpx;
          min-width: 80rpx;
          height: 80rpx;
          background-color: #CFCFCF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36rpx;
          font-weight: bold;
          color: #FFFFFF;
        }

        .img-info {
          background: none;
          border: solid #f0f0f0 1rpx;
        }

        .left-item-card-info {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          flex-direction: column;

          .left-item-card-name {
            font-size: 24rpx;
            line-height: 34rpx;
            color: #333333;
          }

          .left-item-card-phone {
            margin-top: 14rpx;
            font-size: 28rpx;
            line-height: 28rpx;
            color: #999999;
          }
        }
      }
    }

    .no-data {
      width: 100%;
      display: flex;
      align-items: center;
      justify-items: center;
      flex-direction: column;
      margin-top: 25%;

      .no-data-img {
        width: 200rpx;
        height: 200rpx;
      }

      .no-data-name {
        margin-top: 20rpx;
        font-size: 28rpx;
        color: #666666;
      }
    }
  }

  .scroll-right {
    position: absolute;
    right: 32rpx;
    top: 50%;
    transform: translateY(-47%);
    z-index: 999 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .scroll-right-name {
      width: 32rpx;
      height: 32rpx;
      line-height: 32rpx;
      font-size: 24rpx;
      color: #454852;
      margin-top: 4rpx;
      text-align: center;
    }

    .scroll-right-select {
      // padding: 0;
      // margin-right: 14rpx;
      // width: 32rpx;
      // height: 32rpx;
      border-radius: 50%;
      background: #090C15;
      color: #FFFFFF;
    }
  }

  .scroll-bottom-wrapper{
    position: relative;
  }
}
</style>