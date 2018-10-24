import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import ViciousSyndicate from '@/views/ViciousSyndicate'
import TempoStorm from '@/views/TempoStorm'
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
      path: '/ViciousSyndicate',
      name: 'ViciousSyndicate',
      component: ViciousSyndicate
    },
    {
      path: '/TempoStorm',
      name: 'TempoStorm',
      component: TempoStorm
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
