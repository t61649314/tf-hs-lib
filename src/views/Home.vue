<template>
  <div class="home">
      <div class="mini-code-content">
        <p style="padding: 0 1rem">考虑到性能、功能和工作量等因素以后会只更新小程序版：</p>
        <img src="../assets/img/mini-code.jpg">
      </div>
  </div>
</template>

<script>

  export default {
    name: 'Home',
    components: {
    },
    watch: {
    },
    data() {
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .mini-code-content{
    color: red;
    img{
      width: 4rem;
    }
  }
  .type-icon {
    display: inline-block;
    width: 0.6rem;
    height: 0.6rem;
    background-size: contain;
    margin-right: 0.1rem;
    position: relative;
    top: -0.03rem;
  }

  .wild-list .type-icon {
    background-image: url("../assets/img/wild-icon.png");
  }

  .standard-list .type-icon {
    background-image: url("../assets/img/standard-icon.png");
  }

  .list {
    top: 2.2rem;
    .item {
      padding: 0.2rem 0.32rem;
      display: flex;
      align-items: center;
    }
    h3 {
      text-align: left;
      background-color: #fafafa;
      margin: 0;
      padding: 0.3rem;
      font-size: 0.3rem;
    }
  }
</style>
