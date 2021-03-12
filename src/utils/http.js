import axios from 'axios-miniprogram'
// const http = new axios.Axios({
//   adapter: Adapter(),
//   // 配置拆分
//   baseURL: 'https://signtest.cn1.utools.club',

// })
const http = axios
http.defaults.baseURL =
  'https://signtest.cn1.utools.club'
http.defaults.headers = {
  'content-Type': 'application/json'
}

http.interceptors.request.use(
  (config) => {
    // 所有请求都携带token
    Object.assign(config.headers, {
      token: uni.getStorageSync(
        'token'
      )
    })
    // 发送之前操作config
    return config
  },
  (err) => {
    // 处理错误
    return Promise.reject(err)
  }
)

http.interceptors.response.use(
  (response) => {
    // 返回前操作
    return response.data
  },
  (err) => {
    return Promise.reject(err)
  }
)

export default http
