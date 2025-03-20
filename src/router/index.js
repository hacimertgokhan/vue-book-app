import { createRouter, createWebHistory } from "vue-router";
import store from "../store"; // Store'un var olduğuna emin ol
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
        path: "/manage",
        name: "Yönet",
        component: Manage
    },
    {
        path: "/profile",
        name: "Profil",
        component: Profile
    },
    {
        path: "/add-book",
        name: "Kitap Ekleme",
        component: AddBook
    },
    {
        path: '/book/:id',
        name: 'Kitap Detayı',
        component: BookDetails,
        props: true,
    },
    {
        path: '/edit-book/:id',
        name: 'Kitap Düzenleme',
        component: EditBook,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
