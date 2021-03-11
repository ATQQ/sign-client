import http from '../../utils/http'

function login (code, nickName, gender) {
  return http.post('/user/login', {
    code,
    nickName,
    gender
  })
}

export default {
  login
}
