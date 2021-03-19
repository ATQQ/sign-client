<template>
  <view>
    <navigator :url="`../info/info?id=${id}&is_admin=${isAdmin}`">
      <button type="default">基本信息</button>
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
