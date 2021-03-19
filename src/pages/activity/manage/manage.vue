<template>
  <view>
    <navigator url="./create/index">
      <button type="default">创建活动</button>
    </navigator>
    <view class="activityList">
      <view v-for="a in manageActivities" :key="a.activityId">
        <text @click="handleCheckInfo(a.activityId)">{{ a.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  mounted () {
    this.getManageActivities()
  },
  methods: {
    ...mapActions('activity', ['getManageActivities']),
    handleCheckInfo (id) {
      uni.navigateTo({
        url: `../nav/nav?id=${id}&is_admin=true`
      })
    }
  },
  computed: {
    ...mapState('activity', ['manageActivities'])
  }
}
</script>

<style>
</style>
