<template>
  <view class="manage">
    <navigator url="../create/index" class="create-container">
      <van-button plain type="primary" size="large">去创建活动</van-button>
    </navigator>
    <van-divider
      hairline
      contentPosition="center"
      customStyle="margin-top:0;color: #1989fa; border-color: #1989fa; font-size: 16px;"
      >我创建的活动</van-divider
    >
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
            <van-button type="danger" @click="handleDelete(a.activityId)"
              >删除</van-button
            >
          </view>
        </van-swipe-cell>
      </view>
    </view>
    <van-dialog id="van-dialog" />
    <van-toast id="van-toast" />
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Dialog from '../../../wxcomponents/@vant/weapp/dist/dialog/dialog'
import Toast from '../../../wxcomponents/@vant/weapp/dist/toast/toast'
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
    },
    handleDelete (id) {
      Dialog.confirm({
        title: '确认删除此活动吗?',
        message: '此操作将会删除与该活动相关的一切数据'
      })
        .then(() => {
          this.$api.activity.deleteActivity(id).then(() => {
            this.getManageActivities()
            Toast.success('删除成功')
          })
        })
        .catch(() => {
          // on cancel
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
