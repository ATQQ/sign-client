import api from '../../api/index.js'
const state = {
  activityPeople: []
}

const mutations = {
  setActivityPeople (state, payload) {
    state.activityPeople = payload
  },
  rewritePeopleName (state, payload) {
    const { peopleId, name } = payload
    const p = state.activityPeople.find(
      (v) => v.peopleId === peopleId
    )
    p.name = name
  }
}

const actions = {
  getActivityPeopleById (
    context,
    payload
  ) {
    return api.people
      .getActiityPeople(payload)
      .then((res) => {
        context.commit(
          'setActivityPeople',
          res.data.people
        )
      })
  },
  rewritePeopleName (context, payload) {
    const {
      peopleId,
      name,
      activityId
    } = payload
    return api.people
      .rewritePeopleName(
        peopleId,
        name,
        activityId
      )
      .then((res) => {
        context.commit(
          'rewritePeopleName',
          { peopleId, name }
        )
      })
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
