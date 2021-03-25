<template>
  <view class="join-activity">
    <view class="title">
      <text>参与签到</text>
    </view>
    <view class="tips">
      <text>(6位数字字母组合)</text>
    </view>
    <view class="input-container">
      <input
        type="text"
        maxlength="6"
        v-model="pwd"
        placeholder-style="text-align:center;"
        placeholder="签到口令"
      />
    </view>
    <map
      :scale="17"
      enable-poi
      enable-indoorMap
      show-compass
      enable-overlooking
      show-location
      enable-3D
      :markers="markers"
      style="width: 100%; height: 375rpx"
      :latitude="markers[0].latitude"
      :longitude="markers[0].longitude"
    ></map>
    <view class="p20">
      <van-button type="primary" block @click="getNowLocation" round
        >刷新当前位置</van-button
      >
    </view>
    <van-button
      round
      :disabled="pwd.length !== 6"
      @click="handleSign"
      :plain="pwd.length !== 6"
      type="primary"
      >签到</van-button
    >
    <van-toast id="van-toast" />
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Toast from '../../../wxcomponents/@vant/weapp/dist/toast/toast'
import { SignMethod, StatusCode } from '../../constants/index'
import { myLocation } from '../activity/signlist/create/location'
export default {
  data () {
    return {
      pwd: '',
      markers: [myLocation]
    }
  },
  mounted () {
    this.getNowLocation()
  },
  methods: {
    getNowLocation () {
      // eslint-disable-next-line promise/param-names
      return new Promise((res, rej) => {
        uni.getLocation({
          type: 'gcj02',
          success: (e) => {
            console.log(e)
            this.markers[0].latitude = e.latitude
            this.markers[0].longitude = e.longitude
            Toast.success('成功获取位置信息')
            res(e)
          },
          fail: (err) => {
            Toast.fail('请手动点击获取当前位置')
            rej(err)
          }
        })
      })
    },
    handleSign () {
      if (this.pwd.length !== 6) {
        Toast.fail('请输入6位口令')
        return
      }
      uni.showLoading({
        title: '签到中',
        mask: true
      })
      const location = {
        latitude: this.markers[0].latitude,
        longitude: this.markers[0].longitude
      }
      this.$api.record
        .startRecord(SignMethod.gps, { pwd: this.pwd, location })
        .then(() => {
          uni.hideLoading()
          Toast.success('签到成功')
        })
        .catch((err) => {
          const { code, data } = err
          uni.hideLoading()
          if (code === StatusCode.record.notJoin) {
            Toast.success({
              message: '准备加入活动',
              onClose: () => {
                uni.navigateTo({
                  url: `../activity/join/join?pwd=${data.pwd}`
                })
              }
            })
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
