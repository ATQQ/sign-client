import http from '../../utils/http'

function joinActivity (name, pwd) {
  return http.post('/people/join', {
    name,
    pwd
  })
}

function getActiityPeople (activityId) {
  return http.get(`/people/${activityId}`)
}

function rewritePeopleName (peopleId, name, activityId) {
  return http.put(`/people/${peopleId}`, {
    name,
    activityId
  })
}

function deleteActivityPeople (peopleId, activityId) {
  return http.delete(`/people/${peopleId}`, {
    activityId
  })
}
export default {
  joinActivity,
  getActiityPeople,
  rewritePeopleName,
  deleteActivityPeople
}
