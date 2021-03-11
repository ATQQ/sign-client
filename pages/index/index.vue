<template>
  <view class="content">
    <image
      class="logo"
      src="/static/logo.png"
    ></image>
    <view class="text-area">
      <text class="title">{{
        title
      }}</text>
    </view>
    <view class="login">
      <button
        open-type="getUserInfo"
        type="default"
        @getuserinfo="handleGetUserInfo"
      >
        获取用户个人信息
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello World',
    };
  },
  onLoad() {},
  methods: {
    handleGetUserInfo() {
      uni.getUserInfo({
        success: (e) => {
          console.log(e);
        },
        fail: (e) => {
          console.log(e);
        },
      });
    },
  },
  mounted: () => {
    uni.login({
      success: (e) => {
        console.log(e);
        uni.request({
          method: 'GET',
          url:
            'https://signtest.cn1.utools.club/wechat/auth/code2session',
          data: {
            code: e.code,
          },
          success: function (res) {
            console.log(res);
          },
        });
      },
    });
  },
};
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
