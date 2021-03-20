import api from '../../api/index.js'
const state = {
  signRecords: []
}

const mutations = {
  setSignRecords (state, payload) {
    state.signRecords = payload
  }
}

const actions = {
  getSignRecordsById (
    context,
    payload
  ) {
    return api.record.getRecords(payload).then(res => {
      context.commit('setSignRecords', res.data.records)
    })
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
