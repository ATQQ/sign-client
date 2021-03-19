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

export default {
  joinActivity,
  getActiityPeople,
  rewritePeopleName
}
