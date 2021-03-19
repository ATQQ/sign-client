import http from '../../utils/http'

function getActiitySignList (activityId) {
  return http.get(`/sign/list/${activityId}`)
}
function createNewSign (activityId, method, time, location) {
  return http.post(`/sign/${activityId}`, {
    method,
    time,
    location
  })
}
function updateSignStatus (id, status, time = 0) {
  return http.put(`/sign/${id}`, {
    status,
    time
  })
}
export default {
  getActiitySignList,
  createNewSign,
  updateSignStatus
}
