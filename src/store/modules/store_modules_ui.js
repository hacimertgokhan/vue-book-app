export default {
  namespaced: true,
  state: {
    theme: 'light',
    viewMode: 'grid',
    loading: {
      global: false,
      components: {}
    }
  },
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme
    },
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode
    },
    SET_LOADING(state, { component, status }) {
      if (component) {
        state.loading.components[component] = status
      } else {
        state.loading.global = status
      }
    }
  },
  actions: {
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      commit('SET_THEME', newTheme)
    }
  }
}