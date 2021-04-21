import http from '../../utils/http'

function login (code, nickname, gender, avatar) {
  return http.post('/user/login', {
    code,
    nickname,
    gender,
    avatar
  })
}

function webLink () {
  return http.get('/user/web')
}

function loginCode () {
  return http.get('/user/login/code')
}
export default {
  login,
  webLink,
  loginCode
}
