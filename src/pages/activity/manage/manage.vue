<template>
  <view class="manage">
    <navigator url="../create/index" class="create-container">
      <van-button plain type="primary" size="large">去创建活动</van-button>
    </navigator>
    <van-divider
      hairline
      contentPosition="center"
      customStyle="margin-top:0;color: #1989fa; border-color: #1989fa; font-size: 16px;"
    >
      我加入的活动
    </van-divider>
    <van-empty
      v-if="manageActivities.length === 0"
      image="search"
      description="空空如也,快去创建吧"
    />
    <view class="activityList" v-else>
      <view v-for="a in manageActivities" :key="a.activityId">
        <van-swipe-cell right-width="65">
          <van-cell-group>
            <van-cell
              :url="`../nav/nav?is_admin=true&id=${a.activityId}`"
              is-link
              :title="a.name"
              link-type="navigateTo"
            />
          </van-cell-group>
          <view slot="right">
            <!-- TODO: 删除逻辑 -->
            <van-button type="danger">删除</van-button>
          </view>
        </van-swipe-cell>
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

<style scoped>
.manage {
  padding: 20rpx;
}
.create-container {
  padding: 20rpx;
}
</style>
