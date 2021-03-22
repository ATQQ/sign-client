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
      round
      >确定</van-button
    >
    <!-- <text class="title"> 我加入的活动 </text>
    <view class="joinList">
      <view v-for="a in joinActivities" :key="a.activityId">
        <text @click="handleCheckInfo(a.activityId)">{{ a.name }}</text>
      </view>
    </view> -->
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      pwd: ''
    }
  },
  mounted () {
    this.getJoinActivities()
  },
  methods: {
    ...mapActions('activity', ['getJoinActivities']),
    handleCheckInfo (id) {
      uni.navigateTo({
        url: `../nav/nav?id=${id}`
      })
    },
    handleJoinActivity () {
      if (this.pwd.length !== 6) {
        uni.showToast({
          icon: 'none',
          mask: true,
          duration: 1000,
          title: '请输入6位口令'
        })
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
          const { code, data } = res
          if (code === 10002) {
            uni.showToast({
              icon: 'none',
              mask: true,
              duration: 1000,
              title: '口令有误活动不存在'
            })
            return
          }
          // 跳转加入活动页面
          uni.navigateTo({
            url: `activity/activity?activity=${JSON.stringify(data)}`
          })
        })
        .catch(() => {
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
