export default {
  namespaced: true,
  state: {
    rates: {},
    selectedCurrency: 'USD',
    lastSync: null
  },
  mutations: {
    SET_RATES(state, rates) {
      state.rates = rates
      state.lastSync = new Date().toISOString()
    },
    SET_SELECTED_CURRENCY(state, currency) {
      state.selectedCurrency = currency
    }
  },
  actions: {
    async fetchRates({ commit }) {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        const data = await response.json()
        commit('SET_RATES', data.rates)
      } catch (error) {
        throw new Error('Failed to fetch currency rates')
      }
    }
  },
  getters: {
    getRate: (state) => (currency) => {
      return state.rates[currency] || null
    }
  }
}