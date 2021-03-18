import http from '../../utils/http'

function getManageActivity () {
  return http.get('/activity/list')
}

function createActivity (name, description, format = '', count = 0) {
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
export default {
  getManageActivity,
  createActivity,
  updateActivityInfo
}
