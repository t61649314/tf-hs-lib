<template>
  <div class="tempostorm">
    <page-header title="Tempostorm"></page-header>
    <div class="list">
      <router-link class="item" v-for="(value ,key) in obj" :key="key"
                   :to="{path:'/TempostormDetails', query:{parent:key,gParent:parent}}">{{Const.occupationInfo[key].cnName}}
      </router-link>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'
  import dirs from '../../storage/tempo-storm/dir.json'
  import Const from '../../server/spider/const.js'

  export default {
    name: 'TempostormList',
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
