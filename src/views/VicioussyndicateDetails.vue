<template>
  <div class="vicioussyndicate">
    <page-header title="Vicioussyndicate"></page-header>
    <div class="list">
      <div class="deck-item" v-for="(value ,key) in obj" :key="key">
        <img :src="require(`../../storage/vicious-syndicate/${gParent}/${parent}/${value.name}.png`)">
        <button class="btn clipboard-btn" :data-clipboard-text="value.code">复制卡组</button>
      </div>
    </div>
  </div>
</template>
<script>
  import PageHeader from '../components/PageHeader.vue'
  import dirs from '../../storage/vicious-syndicate/dir.json'

  export default {
    name: 'VicioussyndicateDetails',
    components: {
      PageHeader
    },
    data() {
      return {
        gParent: this.$route.query.gParent,
        parent: this.$route.query.parent,
        obj: dirs[this.$route.query.gParent][this.$route.query.parent],
      }
    },
    methods: {}
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .deck-item {
    padding: 0.5rem 0;
    border-bottom: 0.01rem solid #ddd;
    background-color: #fff;
    img {
      width: 4.38rem;
    }
  }

  @media screen and (min-width: 960px) {
    .list {
      text-align: left;
    }

    .deck-item {
      display: inline-block;
      padding: 0.2rem;
      box-sizing: border-box;
      img {
        width: 2rem;
      }
      button {
        width: 2rem;
      }
    }
  }
</style>
