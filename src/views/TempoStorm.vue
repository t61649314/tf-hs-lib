<template>
  <div>
    <page-header title="TempoStorm战报"></page-header>
    <div class="list">
      <router-link class="item" v-for="(item) in Object.keys(dirs).reverse()"
                   :key="item" :to="{path:'/OccupationList', query:{page:item,type:'tempo-storm'}}">{{item}}
      </router-link>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'
  import dirs from '../../storage/tempo-storm/dir.json'

  export default {
    name: 'TempoStorm',
    components: {
      PageHeader
    },
    data() {
      return {
        dirs: dirs
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
