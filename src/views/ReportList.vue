<template>
  <div>
    <page-header :title="reportTitleMap[$route.query.form]+typeTitleMap[$route.query.type]+'战报'"></page-header>
    <div class="list">
      <router-link class="item" v-for="(item) in Object.keys(dirs).reverse()"
                   :key="item"
                   :to="{path:'/OccupationList', query:{page:item,form:$route.query.form,type:$route.query.type}}">
        {{item}}
      </router-link>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'

  export default {
    name: 'TempoStorm',
    components: {
      PageHeader
    },
    data() {
      return {
        reportTitleMap: {"vicious-syndicate": "VS", "tempo-storm": "TS"},
        typeTitleMap: {"wild": "狂野", "standard": "标准"},
        dirs: require(`../../storage/${this.$route.query.form}/${this.$route.query.type + '-dir.json'}`),
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
