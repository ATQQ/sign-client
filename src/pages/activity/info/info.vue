<template>
  <view>
    <view v-show="!!activity.activityId">
      <van-cell-group>
        <van-cell title="活动名称" :value="activity.name" />
        <van-cell title="活动简介">
          <view class="break-all">
            {{ activity.description }}
          </view>
        </van-cell>
        <van-cell title="活动口令" :value="activity.pwd" />
        <van-cell
          title="要求姓名格式"
          label="名称处内容填写参照此格式"
          :value="activity.nameFormat"
        />
        <van-cell title="预计人数" :value="activity.peopleCount" />
      </van-cell-group>
    </view>
    <view class="btn-container">
      <van-button
        type="info"
        block
        @click="rewrite = !rewrite"
        v-show="!rewrite && isAdmin"
        >修改基本信息</van-button
      >
      <view v-show="rewrite && isAdmin">
        <van-button block type="danger" @click="rewrite = !rewrite">
          取消
        </van-button>
        <view style="margin-bottom: 20rpx; display: block"></view>
        <van-button
          :disabled="!isInputOk"
          block
          type="primary"
          @click="handleRewrite"
        >
          确定
        </van-button>
      </view>
    </view>
    <view v-show="rewrite">
      <van-cell-group>
        <van-field
          label="活动名称"
          :value="newName"
          @change="
            (e) => {
              newName = e.detail;
            }
          "
          placeholder="请输入新的活动名称"
          required
          input-align="right"
        />
        <van-field
          type="textarea"
          autosize
          label="简介"
          :value="des"
          @change="
            (e) => {
              newDes = e.detail;
            }
          "
          placeholder="请输入新的简介"
          required
          input-align="right"
        />
      </van-cell-group>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      activity: {},
      rewrite: false,
      isAdmin: false,
      newName: '',
      newDes: ''
    }
  },
  onLoad (params) {
    this.activity = this.getActivityById(params.id)
    this.isAdmin = !!params.is_admin
  },
  computed: {
    ...mapGetters('activity', ['getActivityById']),
    isInputOk () {
      return this.newName && this.newDes
    }
  },
  methods: {
    ...mapActions('activity', ['updateActivityInfo']),
    handleRewrite () {
      const { activityId, nameFormat, peopleCount } = this.activity
      this.updateActivityInfo({
        id: activityId,
        name: this.newName,
        description: this.newDes,
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
        this.activity.name = this.newName
        this.activity.description = this.newDes
        this.newName = ''
        this.newDes = ''
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

.btn-container {
  padding: 20rpx;
}
</style>
