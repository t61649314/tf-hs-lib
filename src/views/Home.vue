<template>
  <div class="home">
    <page-header title="主页" noBack="true"></page-header>
    <div class="list">
      <div class="wild-box">
        <h3>狂野</h3>
        <router-link class="item" :to="{path:'/ViciousSyndicate', query:{type:'wild'}}">VS战报</router-link>
        <router-link class="item" :to="{path:'/TempoStorm', query:{type:'wild'}}">TS战报</router-link>
      </div>
      <div class="standard-box">
        <h3>标准</h3>
        <router-link class="item" :to="{path:'/ViciousSyndicate', query:{type:'standard'}}">VS战报</router-link>
        <router-link class="item" :to="{path:'/TempoStorm', query:{type:'standard'}}">TS战报</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'

  export default {
    name: 'Home',
    components: {
      PageHeader
    },
    data() {
      return {}
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .list {
    h3 {
      text-align: left;
      background-color: #fafafa;
      margin: 0;
      padding: 0.3rem;
      font-size: 0.3rem;
    }
  }
</style>
