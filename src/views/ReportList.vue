<template>
  <div>
    <page-header :title="reportTitleMap[$route.query.form]+typeTitleMap[$route.query.type]+'战报'"></page-header>
    <div class="list">
      <router-link class="item" v-for="(item) in Object.keys(dirs).reverse()"
                   :key="item"
                   :to="{path:'/OccupationList', query:{page:item,form:$route.query.form,type:$route.query.type}}">
        <span class="has-time-title">{{item}}</span>
        <span class="time-text">{{formatTime(dirs[item].time)}}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'
  import moment from 'moment'

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
    methods: {
      formatTime(time) {
        return moment(time).format("YYYY-MM-DD")
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
</style>
