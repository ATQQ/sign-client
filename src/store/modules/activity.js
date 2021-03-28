import api from '../../api/index.js'
const state = {
  manageActivities: [],
  joinActivities: []
}

const mutations = {
  setManageActivities (state, payload) {
    state.manageActivities = payload
  },
  setJoinActivities (state, payload) {
    state.joinActivities = payload
  },
  updateActivityById (state, payload) {
    const { id, ...options } = payload
    const activity = state.manageActivities.find(
      (activity) =>
        activity.activityId === id
    )
    Object.assign(activity, options)
  }
}

const getters = {
  getActivityById: (state) => (id) => {
    return state.manageActivities.find(
      (activity) =>
        activity.activityId === id
    )
  },
  getJoinActivityById: (state) => (id) => {
    return state.joinActivities.find(
      (activity) =>
        activity.activityId === id
    )
  }
}
const actions = {
  getManageActivities (
    context,
    payload
  ) {
    api.activity
      .getManageActivities()
      .then((res) => {
        context.commit(
          'setManageActivities',
          res.data.activities
        )
      })
  },
  updateActivityInfo (context, payload) {
    const { id, ...options } = payload
    return api.activity
      .updateActivityInfo(id, options)
      .then(() => {
        context.commit(
          'updateActivityById',
          payload
        )
      })
  },
  getJoinActivities (context, payload) {
    api.activity
      .getJoinActivities()
      .then((res) => {
        context.commit(
          'setJoinActivities',
          res.data.activities
        )
      })
  }
}
export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
