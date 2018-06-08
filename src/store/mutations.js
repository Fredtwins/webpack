const mutations = {
  SET_USER (state, str) {
    state.user = str
  },
  ADD_NUM (state) {
    state.num += 1
  }
}

export default mutations
