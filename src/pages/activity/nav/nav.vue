<template>
  <view>
    <navigator :url="`../info/info?id=${id}&is_admin=${isAdmin}`">
      <button type="default">基本信息</button>
    </navigator>
    <navigator v-show="isAdmin" :url="`../people/people?id=${id}`">
      <button type="default">活动成员</button>
    </navigator>
    <navigator v-show="isAdmin" :url="`../signlist/signlist?id=${id}`">
      <button type="default">签到列表</button>
    </navigator>
  </view>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      isAdmin: ''
    }
  },
  onLoad (params) {
    this.id = params.id
    this.isAdmin = !!params.is_admin
  }
}
</script>

<style>
</style>
