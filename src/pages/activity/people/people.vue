<template>
  <view>
    <view class="people-list">
      <view class="item" v-for="(p, idx) in activityPeople" :key="p.peopleId">
        <text @click="handleClick(idx)">{{ p.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  methods: {
    ...mapActions('people', ['getActivityPeopleById']),
    handleClick (idx) {
      uni.navigateTo({
        url: `info/info?people=${JSON.stringify(this.activityPeople[idx])}`
      })
    }
  },
  computed: {
    ...mapState('people', ['activityPeople'])
  },
  onLoad (params) {
    this.getActivityPeopleById(params.id)
  }
}
</script>

<style scoped lang="scss">
.people-list {
}
</style>
