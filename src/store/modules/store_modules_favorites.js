export default {
  namespaced: true,
  state: {
    favorites: []
  },
  mutations: {
    ADD_FAVORITE(state, book) {
      state.favorites.push(book)
    },
    REMOVE_FAVORITE(state, bookId) {
      state.favorites = state.favorites.filter(book => book.id !== bookId)
    }
  },
  actions: {
    async toggleFavorite({ commit, state }, book) {
      const exists = state.favorites.some(f => f.id === book.id)
      if (exists) {
        commit('REMOVE_FAVORITE', book.id)
      } else {
        commit('ADD_FAVORITE', book)
      }
    }
  },
  getters: {
    isFavorite: (state) => (bookId) => {
      return state.favorites.some(book => book.id === bookId)
    }
  }
}