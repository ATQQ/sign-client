import api from '../../api/index.js'
const state = {
  signList: []
}

const mutations = {
  setSignList (state, payload) {
    state.signList = payload
  }
}

const actions = {
  getSignListByActivityId (
    context,
    payload
  ) {
    return api.sign.getActiitySignList(payload).then(res => {
      context.commit('setSignList', res.data.sign_list)
    })
  }
}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
