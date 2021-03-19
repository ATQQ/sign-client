<template>
  <view>
    <view v-show="peopleInfo.peopleId">
      <view class="">
        <input v-if="rewrite" type="text" v-model="peopleInfo.name" />
        <text v-else>{{ peopleInfo.name }}</text>
      </view>
      <view class="">
        <text>{{ peopleInfo.joinTime }}</text>
      </view>
    </view>
    <button v-if="rewrite" type="default" @click="handleSure">确认修改</button>
    <button v-else type="default" @click="rewrite = !rewrite">
      修改成员名称
    </button>
  </view>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      peopleInfo: {},
      rewrite: false
    }
  },
  onLoad (params) {
    this.peopleInfo = JSON.parse(params.people)
  },
  methods: {
    ...mapActions('people', ['rewritePeopleName']),
    handleSure () {
      const { peopleId, name, activityId } = this.peopleInfo
      this.rewritePeopleName({ peopleId, name, activityId }).then(() => {
        uni.showToast({
          title: '修改完成',
          duration: 1000,
          mask: true
        })
        this.rewrite = !this.rewrite
      })
    }
  }
}
</script>

<style>
</style>
