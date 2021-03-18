<template>
  <view>
    <navigator :url="`../info/info?id=${id}`">
      <button type="default">基本信息</button>
    </navigator>
  </view>
</template>

<script>
export default {
  data () {
    return {
      id: ''
    }
  },
  onLoad (params) {
    this.id = params.id
  }
}
</script>

<style>
</style>
