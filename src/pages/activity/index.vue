<template>
  <view>
    <navigator url="./create/index">
      <button type="default">创建活动</button>
    </navigator>
    <view class="activityList">
      <view v-for="a in manageActivity" :key="a.activityId">
        <text @click="handleCheckInfo(a.activityId)">{{ a.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  mounted () {
    this.getManageActivity()
  },
  methods: {
    ...mapActions('activity', ['getManageActivity']),
    handleCheckInfo (id) {
      uni.navigateTo({
        url: `nav/nav?id=${id}`
      })
    }
  },
  computed: {
    ...mapState('activity', ['manageActivity'])
  }
}
</script>

<style>
</style>
