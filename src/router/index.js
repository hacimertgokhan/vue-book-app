import { createRouter, createWebHistory } from "vue-router";
import store from "../store"; 
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import ExchangeRates from "@/views/ExchangeRates.vue";
import Register from "@/views/Register.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import Switch from "@/views/Switch.vue";
import Settings from "@/views/Settings.vue";
import BookDetails from "@/views/book/BookDetails.vue";
import Manage from "@/views/Manage.vue";
import Profile from "@/views/Profile.vue";
import EditBook from "@/views/book/EditBook.vue";
import AddBook from "@/views/book/AddBook.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: { requiresAuth: true }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: { requiresAuth: false }
    },
    {
        path: "/exchange",
        name: "Exchange",
        component: ExchangeRates,
        meta: { requiresAuth: true }
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        meta: { requiresAuth: false }
    },
    {
        path: "/forgot-password",
        name: "Forgot Password",
        component: ForgotPassword,
        meta: { requiresAuth: false }
    },
    {
        path: "/account-switch",
        name: "Account Switch",
        component: Switch,
        meta: { requiresAuth: true }
    },
    {
        path: "/settings",
        name: "Ayarlar",
        component: Settings,
        meta: { requiresAuth: true }
    },
    {
        path: "/manage",
        name: "Yönet",
        component: Manage,
        meta: { requiresAuth: true }
    },
    {
        path: "/profile",
        name: "Profil",
        component: Profile,
        meta: { requiresAuth: true }
    },
    {
        path: "/add-book",
        name: "Kitap Ekleme",
        component: AddBook,
        meta: { requiresAuth: true }
    },
    {
        path: '/book/:id',
        name: 'Kitap Detayı',
        component: BookDetails,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/edit-book/:id',
        name: 'Kitap Düzenleme',
        component: EditBook,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.state.user.isAuthenticated;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false);
    if (requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (to.path === '/login' && isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;