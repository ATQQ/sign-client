import api from '../../api/index.js'
const state = {
  manageActivity: []
}

const mutations = {
  setManageActivity (state, payload) {
    state.manageActivity = payload
  },
  updateActivityById (state, payload) {
    const { id, ...options } = payload
    const activity = state.manageActivity.find(
      (activity) =>
        activity.activityId === id
    )
    Object.assign(activity, options)
  }
}

const getters = {
  getActivityById: (state) => (id) => {
    return state.manageActivity.find(
      (activity) =>
        activity.activityId === id
    )
  }
}
const actions = {
  getManageActivity (context, payload) {
    api.activity
      .getManageActivity()
      .then((res) => {
        context.commit(
          'setManageActivity',
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
  }
}
export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
