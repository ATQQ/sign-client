<template>
  <view class="p20">
    <view>
      <van-divider
        contentPosition="center"
        customStyle="color: #1989fa; border-color: #1989fa; font-size: 1rem;"
      >
        选择签到方式
      </van-divider>
      <van-checkbox-group
        style="display: flex; justify-content: space-around"
        :value="methods"
        @change="handleChange"
      >
        <van-checkbox name="1">二维码</van-checkbox>
        <van-checkbox name="2">定位 b</van-checkbox>
      </van-checkbox-group>
    </view>
    <view v-show="methods.includes('2')">
      <text>位置信息</text>
    </view>
    <van-divider
      contentPosition="center"
      customStyle="color: #1989fa; border-color: #1989fa; font-size: 1rem;"
    >
      持续时长
    </van-divider>
    <picker mode="selector" :range="timeRange" @change="handleSelectorChange">
      <view class="time">
        <van-button size="small" type="info" round>更改</van-button>
        <text>{{ time }} mins </text>
      </view>
    </picker>
    <view class="p20">
      <van-button
        :disabled="!isOk"
        size="large"
        @click="handleCreate"
        type="primary"
        round
        >确认创建</van-button
      >
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      methods: [],
      locationInfo: '',
      time: 5,
      activityId: -1,
      timeRange: Array.from({
        length: 60
      }).map((_, i) => i + 1)
    }
  },
  onLoad (params) {
    const { id } = params
    this.activityId = id
  },
  computed: {
    isOk () {
      return this.methods.length > 0
    }
  },
  methods: {
    handleChange (e) {
      this.methods = e.detail
    },
    handleSelectorChange (e) {
      this.time = +e.detail.value + 1
    },
    handleCreate () {
      if (this.methods.length === 0) {
        uni.showToast({
          duration: 1000,
          title: '请至少选择一个签到方式'
        })
        return
      }
      this.$api.sign
        .createNewSign(
          this.activityId,
          this.methods,
          this.time,
          this.locationInfo
        )
        .then((res) => {
          uni.showToast({
            duration: 1000,
            icon: 'success',
            title: '创建成功'
          })
          setTimeout(() => {
            uni.navigateBack()
          }, 800)
        })
    }
  }
}
</script>

<style scoped>
.time {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
