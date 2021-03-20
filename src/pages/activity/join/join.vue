<template>
  <view>
    <view class="">
      <input type="text" v-model="pwd" placeholder="输入课程口令加入" />
      <button type="default" @click="handleJoinActivity">加入活动</button>
    </view>
    <text class="title"> 我加入的活动 </text>
    <view class="joinList">
      <view v-for="a in joinActivities" :key="a.activityId">
        <text @click="handleCheckInfo(a.activityId)">{{ a.name }}</text>
      </view>
    </view>
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

<style>
.title {
  text-align: center;
}
</style>
