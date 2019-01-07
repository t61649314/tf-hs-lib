import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import ReportList from '@/views/ReportList'
import OccupationList from '@/views/OccupationList'
import DeckList from '@/views/DeckList'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/ReportList',
      name: 'ReportList',
      component: ReportList
    },
    {
      path: '/OccupationList',
      name: 'OccupationList',
      component: OccupationList
    },
    {
      path: '/DeckList',
      name: 'DeckList',
      component: DeckList
    }
  ]
})
