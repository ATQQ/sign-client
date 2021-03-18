<template>
  <view>
    <image :src="avatar" mode="aspectFill"></image>
    <view class="">
      <text>{{ nickname }}</text>
      <text>{{ sex }}</text>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import { Gender } from '../../constants/index.js'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState('user', ['avatar', 'nickname', 'gender']),
    sex () {
      return this.gender === Gender.MALE ? '♂' : '♀'
    }
  }
}
</script>

<style>
</style>
