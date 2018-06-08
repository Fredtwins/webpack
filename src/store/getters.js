const getters = {
  filterUser: state => `${state.user} -- ${state.num}`
  // filterUser (state) {
  //   return `${state.user} -- ${state.num}`
  // }
}

export default getters
