<template>
  <div class="page-header">
    <i v-if="!noBack" class="mintui mintui-back" @click="goBack"></i>
    <h1><span class="title-text">{{ title }}</span></h1>
  </div>
</template>

<script>
  export default {
    name: 'PageHeader',
    props: ['title', 'noBack'],
    data() {
      return {}
    },
    methods: {
      goBack() {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .page-header {
    height: 1.2rem;
    z-index: 1;
    background-color: #fff;
    h1 {
      font-size: 0.4rem;
      line-height: 1.2rem;
      margin: 0;
      .title-text{
        display: block;
        margin: auto;
        max-width: 5rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
    .mintui-back {
      display: inline-block;
      top: 0.2rem;
      left: 0.2rem;
      position: absolute;
      width: 0.8rem;
      height: 0.8rem;
      font-size: 0.48rem;
      line-height: 0.8rem;
      text-align: center;
    }
  }
</style>
