const safeGetItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage:`, e)
    return defaultValue
  }
}

export default {
  namespaced: true,
  state: {
    user: safeGetItem('user', null),
    token: null,
    isAuthenticated: !!safeGetItem('user', null),
    accounts: safeGetItem('', []),
    settings: safeGetItem("settings", {
      requirePasswordForSwitch: false
    }),
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isAuthenticated = !!user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_ACCOUNTS(state, accounts) {
      state.accounts = accounts
      localStorage.setItem('accounts', JSON.stringify(accounts))
    },
    UPDATE_USER(state, updatedUser) {
      state.user = { ...state.user, ...updatedUser }
      localStorage.setItem('user', JSON.stringify(state.user))
    }
  },
  actions: {
    async login({ commit }, user) {
      commit('SET_USER', user)
    },
    async logout({ commit }) {
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
    },
    switchAccount({ commit, state }, account) {
      const users = safeGetItem("users", []);
      const user = users.find(u => u.email === account.email);

      if (user) {
        commit("SET_USER", user);
        return true;
      }
      return false;
    },
    updateAccountSettings({ commit }, settings) {
      commit("updateSettings", settings);
    },
    async loadAccounts({ commit }) {
      try {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const accounts = users.map(user => ({
          id: user.id || Math.random(),
          username: user.username || "Unknown Account",
          email: user.email || "Unknown Account",
          name: user.name || "Unknown Account",
          role: user.role || "0",
        }));
        await new Promise(resolve => setTimeout(resolve, 300));
        commit("SET_ACCOUNTS", accounts);
        return accounts;
      } catch (error) {
        console.error("Failed to load accounts:", error);
        throw error;
      }
    },
    updateUser({ commit }, updatedUser) {
      commit("UPDATE_USER", updatedUser);
    }
  }

}