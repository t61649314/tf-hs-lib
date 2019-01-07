<template>
  <div class="home">
    <page-header title="TF套牌库" noBack="true"></page-header>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">狂野模式</mt-tab-item>
      <mt-tab-item id="2">标准模式</mt-tab-item>
    </mt-navbar>
    <div class="list">
      <router-link class="item"
                   :to="{path:'/ReportList', query:{type:selected==='1'?'wild':'standard',form:'vicious-syndicate'}}">
        VS战报
      </router-link>
      <router-link class="item"
                   :to="{path:'/ReportList', query:{type:selected==='1'?'wild':'standard',form:'tempo-storm'}}">
        TS战报
      </router-link>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'
  import Const from '../../server/spider/const.js'

  export default {
    name: 'Home',
    components: {
      PageHeader
    },
    watch: {
      selected: function (val) {
        localStorage.setItem("selected", val);
      },
    },
    data() {
      return {
        Const: Const,
        selected: localStorage.getItem("selected") || '1'
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>

  .list {
    top: 2.2rem;
    h3 {
      text-align: left;
      background-color: #fafafa;
      margin: 0;
      padding: 0.3rem;
      font-size: 0.3rem;
    }
  }
</style>
