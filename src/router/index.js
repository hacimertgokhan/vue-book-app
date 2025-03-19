import { createRouter, createWebHistory } from "vue-router";
import store from "../store"; // Store'un var olduğuna emin ol
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import ExchangeRates from "@/views/ExchangeRates.vue";
import Register from "@/views/Register.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";
import Switch from "@/views/Switch.vue";
import Settings from "@/views/Settings.vue";
import BookDetails from "@/views/BookDetails.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        beforeEnter: (to, from, next) => {
            if (!store.state.user) {
                next("/login");
            } else {
                next();
            }
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/exchange",
        name: "Exchange",
        component: ExchangeRates
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
    {
        path: "/forgot-password",
        name: "Forgot Password",
        component: ForgotPassword
    },
    {
        path: "/account-switch",
        name: "Account Switch",
        component: Switch
    },
    {
        path: "/settings",
        name: "Ayarlar",
        component: Settings
    },
    {
        path: '/book/:id',
        name: 'Kitap Detayı',
        component: BookDetails,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
