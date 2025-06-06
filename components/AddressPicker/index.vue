<template>
	<view class="container">
		<view>
			<view class="mian_info">
				<view class="mian_input">
					<view class="mian_input_title">
						姓名
					</view>
					<view>
						<input class="uni-input" @input="changeRealName" :value="userInfo.realName"
							placeholder-style="color:#999999;fontSize:24rpx;textAlign:right" placeholder="请输入姓名" />
					</view>
				</view>
				<view class="mian_input">
					<view class="mian_input_title">
						手机号码
					</view>
					<view>
						<input class="uni-input" @input="changeTelephone" type="number" :value="telephone"
							placeholder-style="color:#999999;fontSize:24rpx;textAlign:right" placeholder="请输入手机号" />
					</view>
				</view>
				<view class="mian_input">
					<view class="mian_input_title">
						所在区域
					</view>
					<view>
						<cascader v-if="cascader" :values="values" :list="districtList" @confirm="confirm"
							valueKey="value" placeholder="请选择区域"></cascader>
					</view>
				</view>
				<view class="mian_textarea">
					<view class="mian_input_textarea">
						详细地址
					</view>
					<view>
						<textarea @input="changeStreet" :value="street" placeholder-style="color:#999999" maxlength='-1'
							placeholder-class="placeholderStyle" placeholder="请输入详细地址" />
					</view>
				</view>
			</view>
			<view class="sumbit">
				<view class="btn" @click="sumbit">
					<view>
						提交保存
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import request from '@/utils/request.js'
import cascader from './cascader.vue'
function validateTel(email) {
  const telRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
  return telRegex.test(email)
}
export default {
  name: 'addEditAddress',
  data() {
    return {
      navbar: {
        title: '设置地址'
      },
      type: 1,
      userInfo: {
        realName: '',
        telephone: '',
        street: '',
        province: 0,
        city: 0,
        area: 0,
        isDefault: 0,
        uid: '',
        addressArr:[]
      },
      list: [],
      districtList: [],
      areaName: '',
      telephone: '',
      street: '',
      cascader: false,
      values: []
    }
  },
  onLoad(options) {
    this.values = []
    this.getArea()
  },
  components: {
    cascader
  },
  methods: {
    confirm(e) {
      this.userInfo.addressArr = e
    },
    //获取省市区
    getArea() {
      request.post('/opAddress/treeOpAddress', {})
        .then(res => {
          if (res.success) {
            this.districtList = res.result
            this.cascader = true
          } else {
            uni.showToast({
              title: res.message,
              duration: 2000
            });
          }
        })
        .catch(error => {});
    },
    // 手机号编辑
    changeTelephone(e) {
      this.userInfo.telephone = e.detail.value
    },
    //姓名
    changeRealName(e) {
      this.userInfo.realName = e.detail.value
    },
    //详细地址
    changeStreet(e) {
      this.userInfo.street = e.detail.value
    },
    //添加编辑地址
    sumbit() {
      if (!this.userInfo.realName.trim()) {
        uni.showToast({
          title: '请输入姓名',
          duration: 2000
        });
        return
      }

      if (!validateTel(this.userInfo.telephone)) {
        uni.showToast({
          title: '请检查手机号',
          duration: 2000
        });
        return
      }
      if (this.userInfo.addressArr.length == 0) {
        uni.showToast({
          title: '请选择所在区域',
          duration: 2000
        });
        return
      }
      if (!this.userInfo.street.trim()) {
        uni.showToast({
          title: '请输入详细地址',
          duration: 2000
        });
        return
      }
      // var pages = getCurrentPages();
      // var prevPage = pages[pages.length - 2]; //上一个页面
      // prevPage.formdata.name = this.userInfo.realName
      // prevPage.formdata.mobile = this.userInfo.telephone
      // prevPage.formdata.address = this.userInfo.street
      // prevPage.formdata.addressId = this.userInfo.addressArr
      getApp().globalData.address = {
        name: this.userInfo.realName.trim(),
        mobile: this.userInfo.telephone,
        address: this.userInfo.street.trim(),
        addressId: this.userInfo.addressArr
      }
      uni.navigateBack({
        delta: 1
      })
    },
  }
}
</script>

<style scoped lang="scss">
	.container {
		background-color: #FAFAFA;
		padding: 32rpx 32rpx 0 32rpx;
		min-height: 100vh;
		box-sizing: border-box;
	}

	.mian_textarea {
		padding-bottom: 32rpx;
	}

	.mian_input_textarea {
		font-size: 24rpx;
		color: #333333;
		font-weight: bold;
		height: 86rpx;
		line-height: 86rpx;
	}

	::v-deep textarea {
		font-size: 24rpx;
		background-color: #FAFAFA !important;
		min-height: 208rpx;
		padding: 24rpx;
	}

	.mian_info {
		padding: 0 32rpx;
		background-color: #ffffff;

		.mian_input {
			font-size: 24rpx;
			color: #333333;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1rpx solid #F0F1F2;
			height: 86rpx;
			width: 100%;

		}

		.mian_input_title {
			width: 200rpx;
			font-weight: bold;
		}

		.uni-input {
			text-align: right;
			font-size: 24rpx;
			width: calc(750rpx - 350rpx);
		}
	}

	::v-deep .input-value-border {
		border: none !important;
	}

	::v-deep .arrow-area {
		transform: rotate(-135deg);
		margin-bottom: 0;
	}

	::v-deep .is-textarea {
		background-color: #FAFAFA !important;
	}


	.main_check {
		font-size: 24rpx;
		color: #333333;
		display: flex;
		align-items: center;
	}

	.selected {
		display: flex;
	}

	.sumbit {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 24rpx;
		padding-bottom: calc(constant(safe-area-inset-bottom));
		padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
		z-index: 50;
		background-color: #fff;

		.btn {
			height: 100rpx;
			width: 100%;
			background-color: #252525;
			color: #FFFFFF;
			line-height: 100rpx;
			text-align: center;
		}

	}
</style>