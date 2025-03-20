import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import books from './modules/store_modules_books.js'
import user from './modules/store_modules_user.js'
import ui from './modules/store_modules_ui.js'
import favorites from './modules/store_modules_favorites.js'
import comments from './modules/store_modules_comments.js'
import currency from './modules/store_modules_currency.js'

export default createStore({
    modules: {
        books,
        user,
        ui,
        favorites,
        comments,
        currency
    },
    plugins: [
        createPersistedState({
            paths: ['user', 'favorites', 'ui.theme', 'currency.selectedCurrency']
        })
    ]
})