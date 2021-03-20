import http from '../../utils/http'

function startRecord (method, options) {
  return http.post('/record/sign', {
    method,
    ...options
  })
}

function getRecords (id) {
  return http.get(`/record/${id}`)
}

function upRecordTips (peopleId, tips, signId) {
  return http.put(`/record/tips/${peopleId}`, {
    tips,
    signId
  })
}

function upRecordStatus (peopleId, status, signId) {
  return http.put(`/record/status/${peopleId}`, {
    status,
    signId
  })
}
export default {
  startRecord,
  getRecords,
  upRecordTips,
  upRecordStatus
}
