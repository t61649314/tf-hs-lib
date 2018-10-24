<template>
  <div>
    <page-header title="职业列表"></page-header>
    <div class="list">
      <router-link class="item" v-for="(value ,key) in Const.occupationInfo" :key="key"
                   :to="{
                   path:'/DeckList',
                   query:{
                   page:page,
                   type:type,
                   occupation:key
                   }}">
        {{value.cnName}}
      </router-link>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'
  import Const from '../../server/spider/const.js'

  export default {
    name: 'OccupationList',
    components: {
      PageHeader
    },
    data() {
      return {
        Const: Const,
        page: this.$route.query.page,
        type: this.$route.query.type,
      }
    },
    mounted: function () {
      this.init();
    },
    methods: {
      init: function () {
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
