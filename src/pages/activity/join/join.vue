<template>
  <view class="join-activity">
    <view class="title">
      <text>加入活动</text>
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
        placeholder="课程口令"
      />
    </view>
    <van-button
      round
      :disabled="pwd.length !== 6"
      @click="handleJoinActivity"
      :plain="pwd.length !== 6"
      type="primary"
      >确定</van-button
    >
    <van-toast id="van-toast" />
  </view>
</template>

<script>
import { mapState } from 'vuex'
import Toast from '../../../../wxcomponents/@vant/weapp/dist/toast/toast'
export default {
  data () {
    return {
      pwd: ''
    }
  },
  methods: {
    handleJoinActivity () {
      if (this.pwd.length !== 6) {
        Toast.fail('请输入6位口令')
        return
      }
      uni.showLoading({
        title: '查询活动信息中',
        mask: true
      })
      // 获取活动信息
      this.$api.activity
        .getActivityByPwd(this.pwd)
        .then((res) => {
          uni.hideLoading()
          // 跳转加入活动页面
          uni.navigateTo({
            url: `activity/activity?activity=${JSON.stringify(res.data)}`
          })
        })
        .catch((res) => {
          const { code } = res
          if (code === 10002) {
            Toast.fail('口令有误活动不存在')
          }
          uni.hideLoading()
        })
    }
  },
  computed: {
    ...mapState('activity', ['joinActivities'])
  },
  onLoad (params) {
    if (params.pwd) {
      this.pwd = params.pwd
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./join.scss";
</style>
