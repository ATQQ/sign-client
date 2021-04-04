<template>
  <view class="content">
    <!-- 登录 -->
    <view class="avatar-container card">
      <view class="avatar">
        <open-data type="userAvatarUrl"></open-data>
      </view>
      <!-- <image class="avatar" :src="avatar"></image> -->
      <button
        v-if="showLogin"
        class="login"
        open-type="getUserInfo"
        @getuserinfo="handleGetUserInfo"
      >
        点击登录
      </button>
      <view v-else class="info">
        你好，
        <!-- <text class="nickname">{{ nickname }}</text> -->
        <open-data type="userNickName"></open-data>
        <!-- <text class="nickname"></text> -->
        <!-- TODO:性别用颜色加以区分 -->
        <!-- <open-data type="userGender" lang="zh_CN"></open-data> -->
        <!-- <text class="sex">{{ sex }}</text> -->
        <view class="re-login" @click="handleGetUserInfo">
          <van-icon name="replay" />
        </view>
      </view>
    </view>
    <!-- 签到区域 -->
    <view class="card">
      <view class="plr20 fun-title">
        <van-divider
          hairline
          contentPosition="center"
          customStyle="margin-top:0; color: #1989fa; border-color: #1989fa; font-size: 16px;"
          >参与签到</van-divider
        >
      </view>
      <view class="funs plr20">
        <van-row>
          <van-col span="12">
            <view class="fun-item" @click="handleScan">
              <view class="icon-bg-green icon-container">
                <van-icon color="#07c160" size="50px" name="scan"></van-icon>
              </view>
              <text class="text">扫码签到</text>
            </view>
          </van-col>
          <van-col span="12">
            <navigator class="fun-item" url="../locSign/locSign">
              <view class="icon-bg-blue icon-container">
                <van-icon
                  color="#1989fa"
                  size="50px"
                  name="location-o"
                ></van-icon>
              </view>
              <text class="text">定位签到</text>
            </navigator>
          </van-col>
        </van-row>
      </view>
    </view>
    <!-- 功能区域 -->
    <view class="card">
      <view class="plr20 fun-title">
        <van-divider
          hairline
          contentPosition="center"
          customStyle="margin-top:0;color: #1989fa; border-color: #1989fa; font-size: 16px;"
          >活动相关</van-divider
        >
      </view>
      <view class="plr20 funs">
        <van-row gutter="20">
          <van-col span="8" v-for="(fun, idx) in funsConfig" :key="idx">
            <navigator class="fun-item" :url="fun.url">
              <view class="icon-container" :class="[`icon-${fun.bg}`]">
                <van-icon
                  :color="fun.color"
                  size="40px"
                  :name="fun.icon"
                ></van-icon>
              </view>
              <text class="text">{{ fun.text }}</text>
            </navigator>
          </van-col>
        </van-row>
      </view>
    </view>
    <!-- 暂定 -->
    <view class="card">
      <view class="plr20 fun-title">
        <van-divider
          hairline
          contentPosition="center"
          customStyle="margin-top:0;color: #1989fa; border-color: #1989fa; font-size: 16px;"
          >其它</van-divider
        >
      </view>
      <view class="plr20 funs">
        <van-row gutter="20">
          <van-col span="24" v-for="(fun, idx) in infoConfig" :key="idx">
            <navigator class="fun-item" :url="fun.url">
              <view class="icon-container" :class="[`icon-${fun.bg}`]">
                <van-icon
                  :color="fun.color"
                  size="40px"
                  :name="fun.icon"
                ></van-icon>
              </view>
              <text class="text">{{ fun.text }}</text>
            </navigator>
          </van-col>
        </van-row>
      </view>
    </view>
    <van-toast id="van-toast" />
  </view>
</template>
<script>
import { getUserInfo, wxLogin } from '../../utils/userUtil.js'
import { mapState, mapActions } from 'vuex'
import { Gender, SignMethod, StatusCode } from '../../constants/index'
import { funsConfig, infoConfig } from './config'
import Toast from '../../../wxcomponents/@vant/weapp/dist/toast/toast'
export default {
  data () {
    return {
      showLogin: true,
      funsConfig,
      infoConfig
    }
  },
  onShareAppMessage () {
    return {
      title: '活动考勤助手',
      path: '/src/pages/index/index'
    }
  },
  onShareTimeline () {
    return {
      title: '活动考勤助手'
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
    /**
     * 扫一扫签到
     */
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
            Toast.fail('不是二维码')
            return
          }
          try {
            const data = JSON.parse(res.result)
            const { type, qrcode } = data
            switch (type) {
              case 'sign':
                this.$api.record
                  .startRecord(SignMethod.qrCode, {
                    qrcode
                  })
                  .then(() => {
                    uni.hideLoading()
                    Toast.success('签到成功')
                  })
                  .catch((err) => {
                    const { code, data } = err
                    if (code === StatusCode.record.notJoin) {
                      Toast.success({
                        message: '准备跳转加入',
                        onClose: () => {
                          uni.navigateTo({
                            url: `../activity/join/join?pwd=${data.pwd}`
                          })
                        }
                      })
                    }
                  })
                break
            }
          } catch (e) {
            uni.hideLoading()
            Toast.fail('不支持的二维码')
          }
        }
      })
    },
    /**
     * 授权获取基本信息并登录
     */
    handleGetUserInfo () {
      uni.showLoading({
        title: '登陆中',
        mask: true
      })
      // 只能获取匿名的无用信息,换用open-data展示头像与昵称
      getUserInfo()
        .then(([err, res]) => {
          if (!res) {
            this.showLogin = true
            return
          }
          const { nickName, gender, avatarUrl } = res?.userInfo

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
              Toast.success({
                message: '登录成功',
                forbidClick: true
              })
              this.showLogin = false
            } catch (error) {
              Toast.success(`登陆失败\n${JSON.stringify(error)}`)
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
      setTimeout(() => {
        uni.hideLoading()
      }, 5000)
    }
  },
  mounted () {
    this.handleGetUserInfo()
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
