<template>
  <view class="content">
    <!-- 登录 -->
    <view class="avatar-container card">
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
        你好，
        <text class="nickname">{{ nickname }}</text>
        <!-- TODO:性别用颜色加以区分 -->
        <text class="sex">{{ sex }}</text>
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
        >
          参与签到
        </van-divider>
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
        >
          活动相关
        </van-divider>
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
    <!-- <view class="card">
      <view class="plr20 fun-title">
        <van-divider
          hairline
          contentPosition="center"
          customStyle="margin-top:0;color: #1989fa; border-color: #1989fa; font-size: 16px;"
        >
          暂定
        </van-divider>
      </view>
      <view class="plr20 funs">
        <van-row gutter="20">
          <van-col span="8" v-for="(fun, idx) in infoConfig" :key="idx">
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
    </view> -->
  </view>
</template>
<script>
import { getUserInfo, wxLogin } from '../../utils/userUtil.js'
import { mapState, mapActions } from 'vuex'
import { Gender, SignMethod, StatusCode } from '../../constants/index'
import { funsConfig, infoConfig } from './config'
export default {
  data () {
    return {
      showLogin: true,
      funsConfig,
      infoConfig
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
      uni.showLoading({
        title: '登陆中',
        mask: true
      })
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
@import './index.scss';
</style>
