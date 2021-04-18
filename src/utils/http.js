import axios from 'axios-miniprogram'
import { StatusCode } from '../constants'

const http = axios
http.defaults.baseURL =
  'https://service-agthqjcf-1256505457.cd.apigw.tencentcs.com/release'
http.defaults.headers = {
  'content-Type': 'application/json'
}

http.interceptors.request.use(
  config => {
    // 所有请求都携带token
    Object.assign(config.headers, {
      token: uni.getStorageSync('token')
    })
    // 发送之前操作config
    return config
  },
  err => {
    // 处理错误
    return Promise.reject(err)
  }
)
let goHome = false
http.interceptors.response.use(
  response => {
    const { code } = response.data
    if (code !== 0) {
      let errMsg = ''
      switch (code) {
        case StatusCode.nowPower:
          errMsg = '没有权限'
          if (!goHome) {
            goHome = true
            setTimeout(() => {
              goHome = false
              uni.reLaunch({
                url: '/pages/index/index'
              })
            }, 1000)
          }

          break
        case StatusCode.people.exist:
          errMsg = '已经在活动中了'
          break
        case StatusCode.people.notExist:
          errMsg = '活动不存在'
          break
        // case StatusCode.record
        //   .alreadySign:
        //   errMsg = '已经签过到了'
        //   break
        // case StatusCode.record.fail:
        //   errMsg = '签到失败'
        //   break
        // case StatusCode.record
        //   .invalidPWD:
        //   errMsg = '无效口令'
        //   break
        // case StatusCode.record
        //   .invalidQRCode:
        //   errMsg = '无效二维码'
        //   break
        // case StatusCode.record.notJoin:
        //   errMsg = '还未加入活动'
        //   break
        // case StatusCode.record.signOver:
        //   errMsg = '签到已结束'
        //   break
      }
      if (errMsg) {
        uni.showToast({
          title: errMsg
        })
      }
      return Promise.reject(response.data)
    }
    // 返回前操作
    return response.data
  },
  err => {
    return Promise.reject(err)
  }
)

export default http
