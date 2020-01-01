import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home')
    },
    {
      path: '/ReportList',
      name: 'ReportList',
      component: () => import('@/views/ReportList')
    },
    {
      path: '/OccupationList',
      name: 'OccupationList',
      component: () => import('@/views/OccupationList')
    },
    {
      path: '/DeckList',
      name: 'DeckList',
      component: () => import('@/views/DeckList')
    }
  ]
})
