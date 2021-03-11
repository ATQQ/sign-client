<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <view class="login" v-if="showLogin">
      <button
        open-type="getUserInfo"
        type="default"
        @getuserinfo="handleGetUserInfo"
      >
        登录获取用户个人信息
      </button>
    </view>
  </view>
</template>

<script>
import { getUserInfo, wxLogin } from '../../utils/userUtil.js'
export default {
  data () {
    return {
      title: 'Hello World',
      showLogin: false
    }
  },
  methods: {
    handleGetUserInfo () {
      getUserInfo()
        .then(([err, res]) => {
          console.log(res)
          const { nickName, gender } = res?.userInfo
          this.showLogin = false
          uni.showLoading({
            title: '登陆中',
            mask: true
          })
          wxLogin().then(async ([err, res]) => {
            // 自动注册登陆
            const { data: token } = await this.$api.user.login(res.code, nickName, gender)
            console.log(token)
            // 换取token
            // 存入vuex
            this.showLogin = true
            uni.hideLoading()
            uni.showToast({
              title: '登陆成功',
              duration: 1000
            })
          })
        })
        .catch(err => {
          console.log(err)
          this.showLogin = true
        })
    }
  },
  mounted () {
    this.handleGetUserInfo()
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
.login {
  text-align: center;
}
</style>
