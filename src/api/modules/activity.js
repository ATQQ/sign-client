import http from '../../utils/http'

function getManageActivities () {
  return http.get('/activity/list')
}

function createActivity (name, description, format = '', count = 0) {
  if (!format) {
    format = '姓名'
  }
  return http.post('/activity/create', {
    name,
    description,
    format,
    count
  })
}

function updateActivityInfo (id, options) {
  return http.put(`/activity/info/${id}`, options)
}

function getJoinActivities () {
  return http.get('/activity/list/join')
}

function getActivityByPwd (pwd) {
  return http.get(`/activity/info/${pwd}`)
}
export default {
  getManageActivities,
  createActivity,
  updateActivityInfo,
  getJoinActivities,
  getActivityByPwd
}
