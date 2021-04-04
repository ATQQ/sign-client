import api from '../../api/index.js'
const state = {
  signList: [],
  // 用于新建签到的自动跳转
  createNew: false,
  autoSign: {
    method: '',
    pwd: '',
    status: false
  }
}

const mutations = {
  setSignList (state, payload) {
    state.signList = payload
  },
  changeCreateNew (state, payload) {
    state.createNew = payload
  },
  changeAutoSign (state, payload) {
    Object.assign(
      state.autoSign,
      payload
    )
  }
}

const actions = {
  getSignListByActivityId (
    context,
    payload
  ) {
    return api.sign
      .getActiitySignList(payload)
      .then((res) => {
        context.commit(
          'setSignList',
          res.data.sign_list
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
