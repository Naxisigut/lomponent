<template>
  <up-popup v-model:show="show" round="15">
    <view class="picker-container">
      <view class="title">请选择上门时间</view>
      <view class="picker-content">
        <view class="left">
          <view v-for="item in dateList" :key="item.value" @click="onPickDate(item)"
            class="date-item" :class="{active: activeDateOffset === item.offset}">
            {{ item.name }}
          </view>
        </view>
        <scroll-view class="right" :scroll-y="true" :scroll-top="scrollTop">
          <view v-for="item, idx in timeRangeList" :key="item.id" @click.stop="onPickTime(item)"
            class="time-item" :class="{active: activeTimeId === item.id}">
            {{ activeDateOffset === 0 && idx === 0 ? '一小时内' : item.name }}
          </view>
        </scroll-view>
      </view>
    </view>  
  </up-popup>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue';
onMounted(() => {
  // debugger
  updateDateList()
  activeDateOffset.value = dateList.value[0].offset
  // console.log('dateList', JSON.parse(JSON.stringify(dateList.value)));
  updateTimeRangeList()
  // console.log('timeRangeList', JSON.parse(JSON.stringify(timeRangeList.value)));
  const activeTimeItem = timeRangeList.value[0]
  activeTimeId.value = activeTimeItem.id
  value.value = getVal(activeDateOffset.value, activeTimeItem)
})

const show = defineModel('show', {
  default: false
})
const value = defineModel()
// 所有的操作都以MountTime(进入页面\组件mount的时间点)为基准，而不是以每次操作的时间点为基准
const MountTime = new Date()
// const MountTime = new Date('2025-04-27 21:00:00') // 测试

// 当前选中的日期偏移量 今天-0 明天-1 后天-2
const activeDateOffset = ref(0)
const activeTimeId = ref('')
const scrollTop = ref(0)
const dateList = ref([])
const NormalDateList = [
  { name: '今天', offset: 0},
  { name: '明天', offset: 1},
  { name: '后天', offset: 2},
]
// 更新左侧日期列表
const updateDateList = () => {
  const currentHour = MountTime.getHours()
  // 如果当前时间在20:00-24:00之间，只显示明天和后天
  if (currentHour >= 20) {
    dateList.value = NormalDateList.filter(item => item.offset > 0)
  } else {
    dateList.value = NormalDateList
  }
}
// 上门预约的时间段与顺丰一致，早八至晚八，每小时为界
const NormalTimeRangeList = [
  {
    name: '08:00 - 09:00',
    startHour: 8,
    endHour: 9,
    startMinute: 8 * 60,
    endMinute: 9 * 60,
    id: "0809"
  },
  {
    name: '09:00 - 10:00',
    startHour: 9,
    endHour: 10,
    startMinute: 9 * 60,
    endMinute: 10 * 60,
    id: "0910"
  },
  {
    name: '10:00 - 11:00',
    startHour: 10,
    endHour: 11,
    startMinute: 10 * 60,
    endMinute: 11 * 60,
    id: "1011"
  },
  {
    name: '11:00 - 12:00',
    startHour: 11,
    endHour: 12,
    startMinute: 11 * 60,
    endMinute: 12 * 60,
    id: "1112"
  },
  {
    name: '12:00 - 13:00',
    startHour: 12,
    endHour: 13,
    startMinute: 12 * 60,
    endMinute: 13 * 60,
    id: "1213"
  },
  {
    name: '13:00 - 14:00',
    startHour: 13,
    endHour: 14,
    startMinute: 13 * 60,
    endMinute: 14 * 60,
    id: "1314"
  },
  {
    name: '14:00 - 15:00',
    startHour: 14,
    endHour: 15,
    startMinute: 14 * 60,
    endMinute: 15 * 60,
    id: "1415"
  },
  {
    name: '15:00 - 16:00',
    startHour: 15,
    endHour: 16,
    startMinute: 15 * 60,
    endMinute: 16 * 60,
    id: "1516"
  },
  {
    name: '16:00 - 17:00',
    startHour: 16,
    endHour: 17,
    startMinute: 16 * 60,
    endMinute: 17 * 60,
    id: "1617"
  },
  {
    name: '17:00 - 18:00',
    startHour: 17,
    endHour: 18,
    startMinute: 17 * 60,
    endMinute: 18 * 60,
    id: "1718"
  },
  {
    name: '18:00 - 19:00',
    startHour: 18,
    endHour: 19,
    startMinute: 18 * 60,
    endMinute: 19 * 60,
    id: "1819"
  },
  {
    name: '19:00 - 20:00',
    startHour: 19,
    endHour: 20,
    startMinute: 19 * 60,
    endMinute: 20 * 60,
    id: "1920"
  }
]
const timeRangeList = ref([])
// 选择日期
const onPickDate = (item) => {
  // 更新左侧activeDate
  activeDateOffset.value = item.offset
  // 更新右侧时间范围和activeTime，默认为列表中的第一个时间
  updateTimeRangeList()
  const activeTimeItem = timeRangeList.value[0]
  activeTimeId.value = activeTimeItem.id
  value.value = getVal(activeDateOffset.value, activeTimeItem)
  // 右侧列表滚动到顶部
  scrollTop.value = 1
  nextTick(() => {
    scrollTop.value = 0
  })
}
// 更新右侧列表
const updateTimeRangeList = () => {
  if(activeDateOffset.value === 0) {
    timeRangeList.value = NormalTimeRangeList.filter(i => isCurrentTimeInRange(i) !== 1)
  }else{
    timeRangeList.value = NormalTimeRangeList
  }
}

// 选择时间
const onPickTime = (item) => {
  activeTimeId.value = item.id
  value.value = getVal(activeDateOffset.value, item)
  show.value = false
}

// 纯函数，根据offset和timeItem获取时间范围和显示值
const getVal = (offset, timeItem) => {
  const year = MountTime.getFullYear()
  const month = String(MountTime.getMonth() + 1).padStart(2, '0')
  const day = String(MountTime.getDate() + offset).padStart(2, '0')
  const startTime = `${year}-${month}-${day} ${String(timeItem.startHour).padStart(2, '0')}:00:00`
  const endTime = `${year}-${month}-${day} ${String(timeItem.endHour).padStart(2, '0')}:00:00`
  
  let valStr = ""
  const dateItem = NormalDateList.find(i => i.offset === offset)
  if(offset === 0 && isCurrentTimeInRange(timeItem) === 0){
    valStr = "一小时内"
  }else{
    valStr = `${dateItem.name} ${timeItem.name}`
  }
  return {
    startTime,
    endTime,
    valStr
  }
}
// 纯函数，检查当前时间相对于时间段的位置
// 当前时间在时间段 -1:之前 0:之中 1:之后
const isCurrentTimeInRange = (timeSlot) => {
  const currentTotalMinutes = MountTime.getHours() * 60 + MountTime.getMinutes()
  if (currentTotalMinutes < timeSlot.startMinute) {
    return -1 // 之前
  } else if (currentTotalMinutes >= timeSlot.startMinute && currentTotalMinutes < timeSlot.endMinute) {
    return 0 // 之中
  } else {
    return 1 // 之后
  }
}
</script>

<style lang='scss' scoped>
.picker-container{
  .title{
    font-size: 34rpx;
    line-height: 3;
    font-weight: bold;
    padding-left: 20rpx;
  }
}
.picker-content{
  display: flex;
  height: 300rpx;
  font-size: 28rpx;
  line-height: 3;
  text-align: center;
  .left{
    width: 300rpx;
    .date-item{
      &.active{
        background: #fafafa;
        font-weight: 600;
      }
    }
  }
  .right{
    flex: 1;
    background: #fafafa;
    overflow-y: scroll;
    width: 0;
    .time-item{
      // font-variant-numeric: tabular-nums;
      &.active{
        color: #ae2d47;
      }
    }
  }
}

</style>
