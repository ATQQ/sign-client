import http from '../../utils/http'

function joinActivity (name, pwd) {
  return http.post('/people/join', {
    name,
    pwd
  })
}

export default {
  joinActivity
}
