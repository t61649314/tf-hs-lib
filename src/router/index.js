import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Vicioussyndicate from '@/views/Vicioussyndicate'
import VicioussyndicateList from '@/views/VicioussyndicateList'
import VicioussyndicateDetails from '@/views/VicioussyndicateDetails'
import Flex from '@/views/Flex'

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
      path: '/Flex',
      name: 'Flex',
      component: Flex
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
    }
  ]
})
