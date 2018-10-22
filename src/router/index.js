import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Vicioussyndicate from '@/views/Vicioussyndicate'
import VicioussyndicateList from '@/views/VicioussyndicateList'
import VicioussyndicateDetails from '@/views/VicioussyndicateDetails'
import Tempostorm from '@/views/Tempostorm'
import TempostormList from '@/views/TempostormList'
import TempostormDetails from '@/views/TempostormDetails'

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
    },
    {
      path: '/VicioussyndicateList',
      name: 'VicioussyndicateList',
      component: VicioussyndicateList
    },
    {
      path: '/VicioussyndicateDetails',
      name: 'VicioussyndicateDetails',
      component: VicioussyndicateDetails
    },
    {
      path: '/Tempostorm',
      name: 'Tempostorm',
      component: Tempostorm
    },
    {
      path: '/TempostormList',
      name: 'TempostormList',
      component: TempostormList
    },
    {
      path: '/TempostormDetails',
      name: 'TempostormDetails',
      component: TempostormDetails
    }
  ]
})
