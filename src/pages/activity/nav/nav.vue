<template>
  <view class="nav">
    <van-cell-group class="b20">
      <van-cell
        icon="comment-o"
        link-type="navigateTo"
        :url="`../info/info?id=${id}&is_admin=${isAdmin}`"
        title="基本信息"
        is-link
        size="large"
      />
    </van-cell-group>
    <van-cell-group class="b20" v-show="isAdmin">
      <van-cell
        icon="manager-o"
        link-type="navigateTo"
        :url="`../people/people?id=${id}`"
        title="活动成员"
        is-link
        size="large"
      />
    </van-cell-group>
    <van-cell-group class="b20" v-show="isAdmin">
      <van-cell
        icon="label-o"
        link-type="navigateTo"
        :url="`../signlist/signlist?id=${id}`"
        title="签到列表"
        is-link
        size="large"
      />
    </van-cell-group>
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
    console.log(params)
    this.id = params.id
    this.isAdmin = !!params.is_admin
  }
}
</script>

<style scoped>
.nav {
  background-color: rgb(248, 248, 248);
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.b20 {
  margin-bottom: 20rpx;
}
</style>
