<template>
  <view>
    <navigator :url="`create/create?id=${activityId}`" class="p20">
      <van-button type="info" round size="large" plain>新的签到</van-button>
    </navigator>
    <van-cell-group>
      <view class="group-title">所有签到表</view>
      <van-cell
        is-link
        :url="`detail/detail?id=${s.signId}`"
        v-for="(s, idx) in signs"
        :key="s.signId"
      >
        <view slot="title">
          <view class="cell-title">
            <view class="van-cell-text">{{
              `第${signList.length - idx}次签到`
            }}</view>
            <van-tag :type="statusTag[s.status]">{{
              SignStatusText[s.status]
            }}</van-tag>
          </view>
        </view>
      </van-cell>
    </van-cell-group>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { SignStatusText, SignStatus } from '../../../constants/index.js'

export default {
  data () {
    return {
      activityId: '',
      SignStatusText: SignStatusText,
      stop: false,
      statusTag: {
        [SignStatus.ing]: 'success',
        [SignStatus.over]: 'danger',
        [SignStatus.pause]: 'primary'
      }
    }
  },
  methods: {
    ...mapActions('sign', ['getSignListByActivityId']),
    refresh () {
      setTimeout(() => {
        if (this.stop) return
        this.getSignListByActivityId(this.activityId)
        this.refresh()
      }, 1000)
    },
    handleDetail (id) {
      uni.navigateTo({
        url: `detail/detail?id=${id}`
      })
    }
  },
  computed: {
    ...mapState('sign', ['signList']),
    signs () {
      return this.signList.slice(0).reverse()
    }
  },
  onLoad (params) {
    // params.id = '6056f8257be9880013360c4d'
    this.getSignListByActivityId(params.id)
    this.activityId = params.id
    this.refresh()
  },
  onUnload: function () {
    this.stop = true
  }
}
</script>
<style lang="scss" scoped>
.cell-title {
  display: flex;
  align-items: center;
  .van-cell-text {
    margin-right: 20rpx;
  }
}
</style>
