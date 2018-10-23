<template>
  <div class="vicioussyndicate">
    <page-header title="Vicioussyndicate"></page-header>
    <div class="list">
      <router-link class="item" v-for="(value ,key) in obj" :key="key"
                   :to="{path:'/VicioussyndicateDetails', query:{parent:key,gParent:parent}}">
        {{Const.occupationInfo[key].cnName}}
      </router-link>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'
  import dirs from '../../storage/vicious-syndicate/dir.json'
  import Const from '../../server/spider/const.js'

  export default {
    name: 'VicioussyndicateList',
    components: {
      PageHeader
    },
    data() {
      return {
        Const: Const,
        parent: this.$route.query.parent,
        obj: dirs[this.$route.query.parent]
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
