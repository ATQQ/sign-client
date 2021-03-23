<template>
  <view>
    <view class="group-title">填写活动基本信息</view>
    <van-cell-group>
      <van-field
        clearable
        label="名称"
        :value="name"
        @change="
          (e) => {
            name = e.detail;
          }
        "
        placeholder="请输入活动名称"
        required
        input-align="right"
      />
      <van-field
        clearable
        label="介绍"
        :value="description"
        type="textarea"
        autosize
        @change="
          (e) => {
            description = e.detail;
          }
        "
        placeholder="请输入活动简介"
        required
        input-align="right"
      />
      <van-field
        clearable
        label="姓名格式"
        :value="format"
        @change="
          (e) => {
            format = e.detail;
          }
        "
        placeholder="(可选)用于提醒活动成员改名"
        error-message="例如 姓名, 姓名-学号, 姓名-性别等"
        input-align="right"
      />
      <van-field
        clearable
        label="预计人数"
        :value="count"
        type="number"
        @input="hadleInputCount"
        placeholder="(可选)预计活动人数"
        error-message="默认0"
        input-align="right"
      />
    </van-cell-group>
    <view class="sure-container">
      <van-button
        :plain="!isInputOk"
        :disabled="!isInputOk"
        :round="isInputOk"
        type="primary"
        size="large"
        @click="handleCreate"
        >确认创建</van-button
      >
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      name: '',
      description: '',
      format: '',
      count: ''
    }
  },
  computed: {
    isInputOk () {
      return this.name && this.description
    }
  },
  methods: {
    ...mapActions('activity', ['getManageActivities']),
    hadleInputCount (e) {
      if (/\d+/.test(e.detail)) {
        this.count = e.detail
      }
    },
    handleCreate () {
      let { name, description, format, count } = this
      if (!count || count < 0) {
        count = 0
      }
      this.$api.activity
        .createActivity(name, description, format, count)
        .then((res) => {
          if (res.code === 0) {
            uni.showToast({
              title: '创建成功',
              duration: 1000,
              success: () => {
                this.getManageActivities()
                uni.navigateBack()
              }
            })
          }
        })
    }
  }
}
</script>

<style scoped>
.sure-container {
  padding: 20rpx;
}
</style>
