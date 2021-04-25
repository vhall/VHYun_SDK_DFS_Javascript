import Vue from 'vue'
import Router from 'vue-router'
import Login from "./views/login.vue";
import Create from "./views/create.vue";
import Pc from "./views/pc.vue";
import H5 from "./views/h5.vue";

Vue.use(Router)

export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/create'
        },
        {
            path:'/login',
            name:"login",
            component:Login
        },
        {
            path: '/create',
            name: 'create',
            component: Create
        },
        {
            path: '/pc',
            name: 'pc',
            component: Pc
        },
        {
            path: '/h5',
            name: 'h5',
            component: H5
        }
    ]
})