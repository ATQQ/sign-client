<template>
  <view>
    <view>
      <text>签到方式</text>
      <checkbox-group @change="handleChange">
        <label>
          <checkbox :value="1" :checked="qrCode" /><text>二维码</text>
        </label>
        <label>
          <checkbox :value="2" :checked="location" /><text>定位</text>
        </label>
      </checkbox-group>
    </view>
    <view v-show="methods.includes(2)">
      <text>位置信息</text>
    </view>
    <view class="">
      <text>持续时长</text>
      <input type="number" v-model="time" /> （mins）
    </view>
    <button type="default" @click="handleCreate">确认创建</button>
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
      activityId: -1
    }
  },
  onLoad (params) {
    const { id } = params
    this.activityId = id
  },
  methods: {
    handleChange (e) {
      this.methods = e.detail.value.map((v) => +v)
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

<style>
</style>
