<template>
  <div>
    <page-header title="TS战报"></page-header>
    <div class="list">
      <router-link class="item" v-for="(item) in Object.keys(dirs).reverse()"
                   :key="item" :to="{path:'/OccupationList', query:{page:item,form:'tempo-storm',type:$route.query.type}}">{{item}}
      </router-link>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'
  import wildDirs from '../../storage/tempo-storm/wild-dir.json'
  import standardDir from '../../storage/tempo-storm/standard-dir'

  export default {
    name: 'TempoStorm',
    components: {
      PageHeader
    },
    data() {
      return {
        dirs: this.$route.query.type === 'wild' ? wildDirs : standardDir
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
