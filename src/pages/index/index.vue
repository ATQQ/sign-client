<template>
  <view class="content">
    <image class="logo" :src="avatar"></image>
    <view class="text-area">
      <text class="title">{{ nickname }}</text>
      <text class="title">{{ sex }} </text>
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
    <view class="" v-else>
      <navigator url="../personalInfo/index"
        ><button type="default">个人信息</button></navigator
      >
      <navigator url="../activity/manage/manage"
        ><button type="default">我创建的活动</button></navigator
      >
      <navigator url="../activity/join/join"
        ><button type="default">我加入的活动</button></navigator
      >
      <button type="default" @click="handleScan">扫一扫签到</button>
    </view>
  </view>
</template>
<script>
import { getUserInfo, wxLogin } from '../../utils/userUtil.js'
import { mapState, mapActions } from 'vuex'
import { Gender, SignMethod, StatusCode } from '../../constants/index'
export default {
  data () {
    return {
      showLogin: true
    }
  },
  computed: {
    ...mapState('user', ['avatar', 'nickname', 'gender']),
    sex () {
      return this.gender === Gender.MALE ? '♂' : '♀'
    }
  },
  methods: {
    ...mapActions('user', ['setUserInfo', 'setToken']),
    handleScan () {
      uni.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          uni.showLoading({
            title: '签到中',
            mask: true
          })
          if (res.scanType !== 'QR_CODE') {
            uni.hideLoading()
            uni.showToast({
              duration: 1000,
              title: '不是二维码'
            })
            return
          }
          try {
            const data = JSON.parse(res.result)
            const { type, qrcode } = data
            switch (type) {
              case 'sign':
                this.$api.record
                  .startRecord(SignMethod.qrCode, { qrcode })
                  .then(() => {
                    uni.hideLoading()
                    uni.showToast({
                      title: '签到成功'
                    })
                  })
                  .catch((err) => {
                    const { code, data } = err
                    if (code === StatusCode.record.notJoin) {
                      uni.showToast({
                        title: '准备跳转加入'
                      })
                      setTimeout(() => {
                        uni.navigateTo({
                          url: `../activity/join/join?pwd=${data.pwd}`
                        })
                      }, 1100)
                    }
                  })
                break
            }
          } catch (e) {
            uni.hideLoading()
            uni.showToast({
              title: '不支持的二维码'
            })
          }
        }
      })
    },
    /**
     * 授权获取基本信息并登录
     */
    handleGetUserInfo () {
      // TODO
      // console.log('wx.getUserProfile', uni.canIUse('getUserProfile'))
      // uni.getUserProfile({
      //  lang:'zh_CN',
      //  desc:"用户身份认证",
      //  success:function(e){
      //   console.log(e);
      //  },
      //  fail:function(e){
      //   console.log(e);
      //  }
      // })
      getUserInfo()
        .then(([err, res]) => {
          if (!res) {
            this.showLogin = true
            return
          }
          const { nickName, gender, avatarUrl } = res?.userInfo
          uni.showLoading({
            title: '登陆中',
            mask: true
          })

          // 存入vuex
          this.setUserInfo({
            nickname: nickName,
            gender,
            avatar: avatarUrl
          })
          // 登录
          wxLogin().then(async ([err, res]) => {
            try {
              // 自动注册登陆
              const { data: token } = await this.$api.user.login(
                res.code,
                nickName,
                gender,
                avatarUrl
              )
              // 换取token
              // 存入vuex
              this.setToken(token)
              uni.showToast({
                title: '登陆成功',
                duration: 1000
              })
              this.showLogin = false
            } catch (error) {
              uni.showToast({
                title: `登陆失败\n${JSON.stringify(error)}`,
                duration: 1000
              })
              this.showLogin = true
            } finally {
              uni.hideLoading()
            }
          })
        })
        .catch((err) => {
          uni.hideLoading()
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
