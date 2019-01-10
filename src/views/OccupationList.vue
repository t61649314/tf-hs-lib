<template>
  <div>
    <page-header :title="page"></page-header>
    <div class="list">
      <router-link class="item" :occupation="key" v-for="(value ,key) in Const.occupationInfo" :key="key"
                   :to="{
                   path:'/DeckList',
                   query:{
                   form:form,
                   page:page,
                   type:type,
                   occupation:key,
                   time:time
                   }}">
        <div class="occupation-icon"></div>
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
        time: this.$route.query.time,
        page: this.$route.query.page,
        type: this.$route.query.type,
        form: this.$route.query.form,
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
  .item {
    display: flex;
    align-items: center;
    padding: 0.2rem 0.32rem;
  }

</style>
