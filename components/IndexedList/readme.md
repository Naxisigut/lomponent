## 简介
索引列表组件，可用于通讯录，品牌列表，城市列表等。基于liu-indexed-list改写。
https://ext.dcloud.net.cn/plugin?id=12499

## 属性说明
| 名称                         | 类型            | 默认值                 | 描述             |
| ----------------------------|--------------- | ---------------------- | ---------------|
| dataList                    | Array          | []                     | 数据源
| idKey                       | String         | id                     | 显示的主键key值
| nameKey                     | String         | name                   | 显示的名字key值
| phoneKey                    | String         | phone                  | 显示的电话key值
| imgKey                      | String         | img                    | 显示的头像key值
| radius                      | Number         | 4rpx                   | 头像圆角(rpx、px、%)
| @click                      | Function       |                        | 点击列表回调事件
| showAvatar                  | Boolean        |  false                 | 是否显示图片

## 示例
```js
export default {
  data() {
    return {
      dataList: [{
        id: '1',
        name: '刘**',
        phone: '181****5576',
        img: 'https://cdn.pixabay.com/photo/2022/03/31/14/53/camp-7103189_1280.png'
      }, {
        id: '2',
        name: '税**',
        phone: '181****5576',
        img: 'https://cdn.pixabay.com/photo/2021/07/22/11/25/rabbit-6485072_1280.jpg'
      }, {
        id: '3',
        name: '柴**',
        phone: '181****5576',
        img: 'https://cdn.pixabay.com/photo/2020/05/19/13/35/cartoon-5190860_1280.jpg'
      }, {
        id: '4',
        name: '王**',
        phone: '181****5576',
        img: 'https://cdn.pixabay.com/photo/2020/05/19/13/32/cartoon-5190837_1280.jpg'
      }, {
        id: '5',
        name: '马**',
        phone: '181****5576',
        img: 'https://cdn.pixabay.com/photo/2023/03/07/12/45/child-7835677_1280.jpg'
      }, {
        id: '6',
        name: '韩**',
        phone: '181****5576',
        img: 'https://cdn.pixabay.com/photo/2022/11/29/19/05/boho-7625140_1280.jpg'
      }, {
        id: '7',
        name: '张**',
        phone: '181****5576',
        img: 'https://cdn.pixabay.com/photo/2020/05/19/13/32/cartoon-5190837_1280.jpg'
      }, {
        id: '8',
        name: '王**',
        phone: '181****5576',
        img: 'https://cdn.pixabay.com/photo/2020/05/19/13/35/cartoon-5190860_1280.jpg'
      }, {
        id: '9',
        name: '张**',
        phone: '18198045576',
        img: 'https://cdn.pixabay.com/photo/2021/07/22/11/25/rabbit-6485072_1280.jpg'
      }, {
        id: '10',
        name: '李**',
        phone: '181****5576',
        img: 'https://cdn.pixabay.com/photo/2022/03/31/14/53/camp-7103189_1280.png'
      }]
    }
  },
  methods: {
    //点击列表回调事件
    click(e) {
      console.log('点击列表回调：', e)
    }
  }
}

```

```html
<template>
	<view class="page-main">
		<IndexedList :dataList="dataList" @click="click"></IndexedList>
	</view>
</template>
```

## 平台与兼容性
Uniapp 支付宝小程序 微信小程序 H5

## 技术栈
vue2 vue3

## 库依赖
