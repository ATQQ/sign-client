<template>
  <view class="p20">
    <navigator url="../join/join" class="p20">
      <van-button plain type="primary" size="large">去加入活动</van-button>
    </navigator>
    <van-divider
      hairline
      contentPosition="center"
      customStyle="margin-top:0;color: #1989fa; border-color: #1989fa; font-size: 16px;"
    >
      我参与的活动
    </van-divider>
    <van-empty
      v-if="joinActivities.length === 0"
      image="search"
      description="空空如也,快去加入吧"
    />
    <view class="activityList" v-else>
      <view v-for="a in joinActivities" :key="a.activityId">
        <van-cell-group>
          <van-cell
            :url="`../nav/nav?id=${a.activityId}`"
            is-link
            :title="a.name"
            link-type="navigateTo"
          />
        </van-cell-group>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapState('activity', ['joinActivities'])
  },
  mounted () {
    this.getJoinActivities()
  },
  methods: {
    ...mapActions('activity', ['getJoinActivities'])
  }
}
</script>

<style>
</style>
