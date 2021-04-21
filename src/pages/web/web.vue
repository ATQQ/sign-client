<template>
  <div class="web">
    <view class="p20">
      <view class="fun-title">
        <van-divider
          hairline
          contentPosition="center"
          customStyle="margin-top:0; color: #1989fa; border-color: #1989fa; font-size: 16px;"
          >获取电脑访问链接
        </van-divider>
      </view>
      <view class="p20">
        <van-button type="info" round @click="handleGetWebLink" block
          >点我获取</van-button
        >
      </view>
    </view>
    <view class="p20">
      <view class="fun-title">
        <van-divider
          hairline
          contentPosition="center"
          customStyle="margin-top:0; color: #1989fa; border-color: #1989fa; font-size: 16px;"
          >登录验证码
        </van-divider>
      </view>
      <view class="code">
        {{ code }}
      </view>
      <view class="p20">
        <van-button @click="handleGetCode" type="primary" round block
          >刷新验证码</van-button
        >
      </view>
    </view>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Toast from '../../wxcomponents/@vant/weapp/dist/toast/toast'
import { setClipboardStr } from '../../utils/device'

export default {
  components: {},
  data () {
    return {
      code: '----'
    }
  },
  computed: {},
  methods: {
    handleGetWebLink () {
      this.$api.user.webLink().then(res => {
        setClipboardStr(res.data.link, '链接复制成功')
      })
    },
    handleGetCode () {
      this.$api.user.loginCode().then(res => {
        this.code = res.data.num
        Toast.success('刷新成功')
      })
    }
  }
}
</script>

<style scoped>
.web {
  padding: 10rpx;
}
.code {
  font-weight: bold;
  font-size: 66rpx;
  text-align: center;
}
</style>
