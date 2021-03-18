<template>
  <view>
    <view class="" v-show="!!activity.activityId">
      <view class="item">
        <input type="text" v-model="activity.name" v-if="rewrite" />
        <text v-else>{{ activity.name }}</text>
      </view>
      <view class="item">
        <input type="text" v-model="activity.description" v-if="rewrite" />
        <text v-else>{{ activity.description }}</text>
      </view>
      <view class="item">
        <input type="text" v-model="activity.nameFormat" v-if="rewrite" />
        <text v-else>{{ activity.nameFormat }}</text>
      </view>
      <view class="item">
        <input type="number" v-model="activity.peopleCount" v-if="rewrite" />
        <text v-else>{{ activity.peopleCount }}</text>
      </view>
      <view class="item">
        <text>{{ activity.pwd }}</text>
      </view>
    </view>
    <button type="default" @click="rewrite = !rewrite" v-show="!rewrite">
      修改基本信息
    </button>
    <button type="default" @click="handleRewrite" v-show="rewrite">
      完成修改
    </button>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      activity: {},
      rewrite: false
    }
  },
  onLoad (params) {
    this.activity = this.getActivityById(params.id)
  },
  computed: {
    ...mapGetters('activity', ['getActivityById'])
  },
  methods: {
    ...mapActions('activity', ['updateActivityInfo']),
    handleRewrite () {
      const {
        activityId,
        name,
        description,
        nameFormat,
        peopleCount
      } = this.activity
      this.updateActivityInfo({
        id: activityId,
        name,
        description,
        nameFormat,
        peopleCount
      }).then(() => {
        uni.showToast({
          icon: 'success',
          title: '修改成功',
          mask: true,
          duration: 1000
        })
        this.rewrite = !this.rewrite
      })
    }
  }
}
</script>

<style>
.item {
  text-align: center;
  margin: 10rpx;
}
</style>
