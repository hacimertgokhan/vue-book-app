const safeGetItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage:`, e);
    return defaultValue;
  }
};

export default {
  namespaced: true,
  state: {
    user: safeGetItem('user', null),
    token: null,
    isAuthenticated: !!safeGetItem('user', null),
    accounts: [],
    allUsers: safeGetItem('users', []),
    settings: safeGetItem("settings", {
      requirePasswordForSwitch: false
    }),
    selectedAccount: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isAuthenticated = !!user;
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_ACCOUNTS(state, accounts) {
      state.accounts = accounts;
    },
    SET_ALL_USERS(state, users) {
      state.allUsers = users;
      localStorage.setItem('users', JSON.stringify(users));
    },
    UPDATE_USER(state, updatedUser) {
      state.user = { ...state.user, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(state.user));

      // allUsers listesini de güncelle
      const index = state.allUsers.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        state.allUsers.splice(index, 1, { ...state.allUsers[index], ...updatedUser });
        localStorage.setItem('users', JSON.stringify(state.allUsers));
      }
    },
    SET_SETTINGS(state, settings) {
      state.settings = { ...state.settings, ...settings };
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    SET_SELECTED_ACCOUNT(state, account) {
      state.selectedAccount = account;
    },
  },
  actions: {
    async login({ commit }, user) {
      commit('SET_USER', user);
    },
    async logout({ commit }) {
      commit('SET_USER', null);
      commit('SET_TOKEN', null);
    },
    switchAccount({ commit, state }, account) {
      const user = state.allUsers.find(u => u.email === account.email);

      if (user) {
        commit("SET_USER", user);
        commit("SET_SELECTED_ACCOUNT", null); //Başarılı geçiş sonrası temizle
        return true;
      }
      return false;
    },
    updateAccountSettings({ commit }, settings) {
      commit('SET_SETTINGS', settings);
    },
    async loadAccounts({ commit, dispatch }) {
      try {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const accounts = users.map(user => ({
          id: user.id || Math.random(),
          username: user.username || "Unknown Account",
          email: user.email || "Unknown Account",
          name: user.name || "Unknown Account",
          role: user.role || "0",
        }));
        commit("SET_ACCOUNTS", accounts);
        commit("SET_ALL_USERS", users);
        return accounts;
      } catch (error) {
        console.error("Failed to load accounts:", error);
        throw error;
      }
    },
    updateUser({ commit }, updatedUser) {
      commit("UPDATE_USER", updatedUser);
    },
    setSelectedAccount({ commit }, account) {
      commit("SET_SELECTED_ACCOUNT", account);
    },
    toggleAdmin({ commit, state }) {
      const newRole = state.user.role === 0 ? 1 : 0;
      const updatedUser = { ...state.user, role: newRole };
      commit('UPDATE_USER', updatedUser);
    }
  }
};