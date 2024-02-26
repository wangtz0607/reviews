import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    keyword: '',
    loadingCount: 0
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    startLoading(state) {
      ++state.loadingCount;
    },
    endLoading(state) {
      --state.loadingCount;
    }
  },
  getters: {
    loading(state) {
      return state.loadingCount > 0;
    }
  }
});
