<template>
  <div>
    <page-header :title="page"></page-header>
    <div class="list">
      <router-link  class="item" :occupation="key" v-for="(value ,key) in Const.occupationInfo"
                   :key="key"
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
  import {Indicator} from 'mint-ui'
  import axios from 'axios'

  export default {
    name: 'OccupationList',
    components: {
      PageHeader
    },
    data() {
      return {
        deckList: {},
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
        // Indicator.open();
        // axios.get(`/my-h5-page/storage/${this.$route.query.form}/${this.$route.query.type}/deck/${this.$route.query.page}.json`).then(({data}) => {
        //   Indicator.close();
        //   if (data) {
        //     this.deckList = data;
        //   }
        // })
        // this.deckList = require(`../../storage/${this.$route.query.form}/${this.$route.query.type}/deck/${this.$route.query.page}.json`);
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
