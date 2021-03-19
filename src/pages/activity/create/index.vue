<template>
  <view>
    <text>创建活动</text>
    <view class>
      <view class>
        <input type="text" placeholder="活动名称" v-model="name" />
        <textarea placeholder="介绍" v-model="description" />
        <input placeholder="姓名格式" type="text" v-model="format" />
        <input placeholder="预计人数" type="number" v-model="count" />
      </view>
      <button type="default" @click="handleCreate">确认创建</button>
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
      count: 0
    }
  },
  methods: {
    ...mapActions('activity', ['getManageActivities']),
    handleCreate () {
      const { name, description, format, count } = this
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

<style>
</style>
