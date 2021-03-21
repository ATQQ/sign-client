<template>
  <view class="content">
    <view class="info-container plr20">
      <view class="avatar-container">
        <image class="avatar" :src="avatar"></image>
        <button
          v-if="showLogin"
          class="login"
          open-type="getUserInfo"
          @getuserinfo="handleGetUserInfo"
        >
          点击登录
        </button>
        <view v-else class="info">
          <text class="nickname">{{ nickname }}</text>
          <!-- TODO:性别用颜色加以区分 -->
          <text class="sex">{{ sex }}</text>
        </view>
      </view>
    </view>

    <view class="plr20 fun-title">
      <van-divider
        hairline
        contentPosition="center"
        customStyle="color: #1989fa; border-color: #1989fa; font-size: 16px;"
      >
        签到区域
      </van-divider>
    </view>
    <view class="funs plr20">
      <van-row gutter="100">
        <van-col span="12">
          <view class="fun-item" @click="handleScan">
            <view class="icon-bg-green icon-container">
              <van-icon color="#07c160" size="50px" name="scan"></van-icon>
            </view>
            <text class="text">扫码签到</text>
          </view>
        </van-col>
        <van-col span="12">
          <view class="fun-item">
            <view class="icon-bg-blue icon-container">
              <van-icon
                color="#1989fa"
                size="50px"
                name="location-o"
              ></van-icon>
            </view>
            <text class="text">定位签到</text>
          </view>
        </van-col>
      </van-row>
    </view>
    <view class="plr20 fun-title">
      <van-divider
        hairline
        contentPosition="center"
        customStyle="color: #1989fa; border-color: #1989fa; font-size: 16px;"
      >
        功能区域
      </van-divider>
    </view>
    <view class="plr20 fun-title">
      <van-row gutter="20">
        <van-col span="8">
          <navigator class="fun-item" url="../activity/join/join">
            <view class="icon-bg-green icon-container">
              <van-icon color="#07c160" size="40px" name="friends-o"></van-icon>
            </view>
            <text class="text">加入活动</text>
          </navigator>
        </van-col>
        <van-col span="8">
          <navigator class="fun-item" url="../activity/create/index">
            <view class="icon-bg-blue icon-container">
              <van-icon color="#1989fa" size="40px" name="award-o"></van-icon>
            </view>
            <text class="text">创建活动</text>
          </navigator>
        </van-col>
        <van-col span="8">
          <navigator class="fun-item" url="../activity/manage/manage">
            <view class="icon-bg-red icon-container">
              <van-icon color="#ee0a24" size="40px" name="setting-o"></van-icon>
            </view>
            <text class="text">活动管理</text>
          </navigator>
        </van-col>
      </van-row>
    </view>
    <!-- <view class="" v-else>
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
    </view> -->
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

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.plr20 {
  padding: 0 20rpx;
}
.info-container {
  background-color: $c-primary;
  padding: 20rpx;
  width: 100%;
  .avatar-container {
    padding: 20rpx;
    margin: 20rpx 40rpx;
    border-radius: 10rpx;
    background-color: #fff;
    box-shadow: 0 0 5rpx #ddd;
    display: flex;
    align-items: center;
    .avatar {
      border-radius: 50%;
      width: 100rpx;
      height: 100rpx;
    }
    .login {
      background-color: #fff;
      padding: 0;
      border: none;
      text-align: left;
      margin-left: 40rpx;
      flex-grow: 1;
      font-size: 1rem;
    }
    .login::after {
      border: none;
    }
    .info {
      text-align: center;
      font-size: 1rem;
      margin-left: 40rpx;
      .sex {
        margin-left: 10rpx;
      }
    }
  }
}
.fun-title {
  width: 86%;
}
.fun-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon-container {
    border-radius: 50%;
    padding: 30rpx;
  }
  .icon-bg-green {
    background-color: #defcec;
  }
  .icon-bg-blue {
    background-color: #dce9f6;
  }
  .icon-bg-red {
    background-color: #fff1f2;
  }
  .text {
    padding-top: 16rpx;
    font-size: 0.8rem;
    text-align: center;
  }
}
</style>
