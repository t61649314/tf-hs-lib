import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Vicioussyndicate from '@/views/Vicioussyndicate'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/Vicioussyndicate',
            name: 'Vicioussyndicate',
            component: Vicioussyndicate
        }
    ]
})
