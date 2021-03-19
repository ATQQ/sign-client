<template>
  <view>
    <text>所有签到表</text>
    <navigator :url="`create/create?id=${activityId}`">
      <button type="default">新的签到</button>
    </navigator>

    <view
      class="list"
      v-for="(s, idx) in signList"
      :key="s.signId"
      @click="handleDetail(s.signId)"
    >
      <text>第{{ idx + 1 }}次签到</text>
      <view class=""> 状态：{{ SignStatusText[s.status] }} </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { SignStatusText } from '../../../constants/index.js'

export default {
  data () {
    return {
      activityId: '',
      SignStatusText: SignStatusText,
      stop: false
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
    ...mapState('sign', ['signList'])
  },
  onLoad (params) {
    this.getSignListByActivityId(params.id)
    this.activityId = params.id
    this.refresh()
  },
  onUnload: function () {
    this.stop = true
  }
}
</script>
