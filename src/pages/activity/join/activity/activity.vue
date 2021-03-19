<template>
  <view>
    <text>加入活动</text>
    <view class="" v-if="activity.activityId">
      <input type="text" v-model="activity.pwd" />
      <input :placeholder="activity.nameFormat" type="text" v-model="name1" />
      <input placeholder="请再次录入" type="text" v-model="name2" />
    </view>
    <button type="default" @click="handleJoin">确认加入</button>
  </view>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      activity: {},
      name1: '',
      name2: ''
    }
  },
  onLoad (params) {
    this.activity = JSON.parse(params.activity)
  },
  methods: {
    ...mapActions('activity', ['getJoinActivities']),
    handleJoin () {
      if (this.name1 !== this.name2) {
        uni.showToast({
          duration: 1000,
          icon: 'none',
          title: '两次输入的姓名不一致'
        })
        return
      }
      this.$api.people
        .joinActivity(this.name1, this.activity.pwd)
        .then((res) => {
          const { code } = res
          if (code === 10001) {
            uni.showToast({
              duration: 1000,
              icon: 'none',
              title: '已经在活动中了'
            })
            return
          }
          if (code === 10001) {
            uni.showToast({
              duration: 1000,
              icon: 'none',
              title: '活动不存在'
            })
            return
          }
          uni.showToast({
            duration: 1000,
            icon: 'success',
            title: '加入成功'
          })
          this.getJoinActivities()
          setTimeout(() => {
            uni.navigateBack()
          }, 1100)
        })
    }
  }
}
</script>

<style>
</style>
