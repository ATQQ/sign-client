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
        <van-checkbox name="2">定位</van-checkbox>
      </van-checkbox-group>
    </view>
    <view v-if="methods.includes('2')">
      <van-divider
        contentPosition="center"
        customStyle="color: #1989fa; border-color: #1989fa; font-size: 1rem;"
      >
        选择签到位置
      </van-divider>
      <view class="group-title">蓝色表示我的位置,红色表示签到点</view>
      <view class="p20">
        <van-button type="info" block round @click="getNowLocation"
          >刷新重置</van-button
        >
      </view>
      <view class="p20">
        <van-button type="primary" block round @click="chooseLocation"
          >精准选择签到位置</van-button
        >
      </view>
      <map
        :scale="17"
        enable-poi
        enable-indoorMap
        @tap="handleTapMap"
        show-compass
        enable-overlooking
        show-location
        enable-3D
        :markers="markers"
        style="width: 100%; height: 375rpx"
        :latitude="markers[0].latitude"
        :longitude="markers[0].longitude"
      ></map>
      <view class="group-title">建议打开GPS,提高精确度</view>
      <view class="group-title">可直接点击小地图更改签到位置</view>
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
    <van-toast id="van-toast" />
  </view>
</template>

<script>
import { myLocation, location } from './location'
import Toast from '../../../../../wxcomponents/@vant/weapp/dist/toast/toast'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      methods: [],
      locationInfo: '',
      time: 5,
      activityId: -1,
      timeRange: Array.from({
        length: 60
      }).map((_, i) => i + 1),
      markers: [myLocation, location]
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
  watch: {
    methods (to, form) {
      if (to.includes('2')) {
        this.getNowLocation()
      }
    }
  },
  methods: {
    ...mapMutations('sign', ['changeCreateNew']),
    chooseLocation () {
      uni.chooseLocation({
        success: (e) => {
          this.updateLocation(e.latitude, e.longitude)
        }
      })
    },
    handleTapMap (e) {
      const { latitude, longitude } = e.detail
      this.updateLocation(latitude, longitude)
    },
    updateLocation (latitude, longitude) {
      this.markers[1].latitude = latitude
      this.markers[1].longitude = longitude
    },
    getNowLocation () {
      uni.getLocation({
        type: 'gcj02',
        success: (e) => {
          this.markers[0].latitude = e.latitude
          this.markers[0].longitude = e.longitude
          this.markers[1].latitude = e.latitude
          this.markers[1].longitude = e.longitude
        },
        fail: () => {
          Toast.fail('请手动点击获取当前位置')
        }
      })
    },
    handleChange (e) {
      this.methods = e.detail
    },
    handleSelectorChange (e) {
      this.time = +e.detail.value + 1
    },
    handleCreate () {
      if (this.methods.length === 0) {
        Toast.fail('请至少选择一个签到方式')
        return
      }
      this.locationInfo = {
        latitude: this.markers[1].latitude,
        longitude: this.markers[1].longitude
      }
      this.$api.sign
        .createNewSign(
          this.activityId,
          this.methods.map((v) => +v),
          this.time,
          this.locationInfo
        )
        .then((res) => {
          this.changeCreateNew(true)
          Toast.success({
            message: '创建成功',
            onClose: () => {
              uni.navigateBack()
            }
          })
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
