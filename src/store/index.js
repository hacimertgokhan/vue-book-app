import { createStore } from "vuex";

// localStorage'dan güvenli veri okuma fonksiyonu
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

const store = createStore({
    state: {
        user: safeGetItem("user", null),
        accounts: safeGetItem("accounts", []),
        settings: safeGetItem("settings", {
            requirePasswordForSwitch: false
        }),
        selectedAccount: null,
        rates: {},
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            localStorage.setItem("user", JSON.stringify(user));

            // Hesabı accounts listesine ekle (eğer yoksa)
            if (user) {
                const existingAccount = state.accounts.find(acc => acc.email === user.email);
                if (!existingAccount) {
                    state.accounts.push({
                        email: user.email,
                        username: user.username
                    });
                    localStorage.setItem("accounts", JSON.stringify(state.accounts));
                }
            }
        },
        setAccounts(state, accounts) {
            state.accounts = accounts;
            localStorage.setItem("accounts", JSON.stringify(accounts));
        },
        logout(state) {
            state.user = null;
            localStorage.removeItem("user");
        },
        setRates(state, rates) {
            state.rates = rates;
        },
        setSelectedAccount(state, account) {
            state.selectedAccount = account;
        },
        updateSettings(state, settings) {
            state.settings = { ...state.settings, ...settings };
            localStorage.setItem("settings", JSON.stringify(state.settings));
        }
    },
    actions: {
        login({ commit }, user) {
            commit("setUser", user);
        },
        logout({ commit }) {
            commit("logout");
        },
        async fetchRates({ commit }) {
            try {
                const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
                const data = await response.json();
                commit("setRates", data.rates);
            } catch (error) {
                console.error("Döviz kurları alınırken bir hata oluştu:", error);
            }
        },
        loadAccounts({ commit }) {
            const accounts = safeGetItem("accounts", []);
            commit("setAccounts", accounts);
        },
        switchAccount({ commit, state }, account) {
            const users = safeGetItem("users", []);
            const user = users.find(u => u.email === account.email);

            if (user) {
                commit("setUser", user);
                return true;
            }
            return false;
        },
        updateAccountSettings({ commit }, settings) {
            commit("updateSettings", settings);
        }
    }
});

export default store;