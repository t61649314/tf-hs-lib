<template>
  <div>
    <page-header title="Flex"></page-header>
    flex-direction: row
    <div class="box" style="flex-direction: row">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    flex-direction: row-reverse
    <div class="box" style="flex-direction: row-reverse">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    flex-direction: column
    <div class="box" style="flex-direction: column">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    flex-direction: column-reverse
    <div class="box" style="flex-direction: column-reverse">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    flex-wrap: nowrap
    <div class="box" style="flex-wrap: nowrap">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
      <div class="box-item">4</div>
      <div class="box-item">5</div>

    </div>
    flex-wrap: wrap
    <div class="box" style="flex-wrap: wrap">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
      <div class="box-item">4</div>
      <div class="box-item">5</div>
    </div>
    flex-wrap:wrap-reverse
    <div class="box" style="flex-wrap:wrap-reverse;">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
      <div class="box-item">4</div>
      <div class="box-item">5</div>
    </div>
    justify-content: flex-start
    <div class="box" style="justify-content: flex-start">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    justify-content: flex-end
    <div class="box" style="justify-content: flex-end">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    justify-content: center
    <div class="box" style="justify-content: center">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    justify-content: space-between
    <div class="box" style="justify-content: space-between">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    justify-content: space-around
    <div class="box" style="justify-content: space-around">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    align-items:flex-start
    <div class="box" style="align-items:flex-start;height: 2rem">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    align-items:flex-end
    <div class="box" style="align-items:flex-end;height: 2rem">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    align-items: center
    <div class="box" style="align-items: center;height: 2rem">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
    </div>
    align-items: baseline
    <div class="box" style="align-items: baseline;height: 2rem">
      <div class="box-item">1</div>
      <div class="box-item" style="line-height: initial;">2</div>
      <div class="box-item" style="line-height: initial;">3</div>
    </div>
    align-items: stretch
    <div class="box" style="align-items: stretch;height: 2rem">
      <div class="box-item" style="height: auto;">1</div>
      <div class="box-item" style="height: auto;">2</div>
      <div class="box-item" style="height: auto;">3</div>
    </div>
    align-content: flex-start
    <div class="box" style="align-content: flex-start;flex-wrap:wrap;height: 6rem">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
      <div class="box-item">4</div>
      <div class="box-item">5</div>
      <div class="box-item">6</div>
      <div class="box-item">7</div>
      <div class="box-item">8</div>
      <div class="box-item">9</div>
      <div class="box-item">10</div>
    </div>
    align-content: flex-end
    <div class="box" style="align-content: flex-end;flex-wrap:wrap;height: 6rem">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
      <div class="box-item">4</div>
      <div class="box-item">5</div>
      <div class="box-item">6</div>
      <div class="box-item">7</div>
      <div class="box-item">8</div>
      <div class="box-item">9</div>
      <div class="box-item">10</div>
    </div>
    align-content: center
    <div class="box" style="align-content: center;flex-wrap:wrap;height: 6rem">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
      <div class="box-item">4</div>
      <div class="box-item">5</div>
      <div class="box-item">6</div>
      <div class="box-item">7</div>
      <div class="box-item">8</div>
      <div class="box-item">9</div>
      <div class="box-item">10</div>
    </div>
    align-content: stretch
    <div class="box" style="align-content: stretch;flex-wrap:wrap;height: 6rem">
      <div class="box-item" style="height: auto;">1</div>
      <div class="box-item" style="height: auto;">2</div>
      <div class="box-item" style="height: auto;">3</div>
      <div class="box-item" style="height: auto;">4</div>
      <div class="box-item" style="height: auto;">5</div>
      <div class="box-item" style="height: auto;">6</div>
      <div class="box-item" style="height: auto;">7</div>
      <div class="box-item" style="height: auto;">8</div>
      <div class="box-item" style="height: auto;">9</div>
      <div class="box-item" style="height: auto;">10</div>
    </div>
    align-content: space-between
    <div class="box" style="align-content: space-between;flex-wrap:wrap;height: 6rem">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
      <div class="box-item">4</div>
      <div class="box-item">5</div>
      <div class="box-item">6</div>
      <div class="box-item">7</div>
      <div class="box-item">8</div>
      <div class="box-item">9</div>
      <div class="box-item">10</div>
    </div>
    align-content: space-around
    <div class="box" style="align-content: space-around;flex-wrap:wrap;height: 6rem">
      <div class="box-item">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
      <div class="box-item">4</div>
      <div class="box-item">5</div>
      <div class="box-item">6</div>
      <div class="box-item">7</div>
      <div class="box-item">8</div>
      <div class="box-item">9</div>
      <div class="box-item">10</div>
    </div>

    order
    <div class="box">
      <div class="box-item" style="order: 10">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
      <div class="box-item">4</div>
      <div class="box-item">5</div>
      <div class="box-item">6</div>
      <div class="box-item" style="order: 0.5">7</div>
      <div class="box-item" style="order: 0">8</div>
      <div class="box-item" style="order: -1">9</div>
      <div class="box-item" style="order: 1">10</div>
    </div>
    flex-grow
    <div class="box" style="flex-wrap: wrap">
      <div class="box-item" style="flex-grow: 9">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
      <div class="box-item">4</div>
      <div class="box-item">5</div>
      <div class="box-item">6</div>
      <div class="box-item" style="flex-grow: 2">7</div>
      <div class="box-item" style="flex-grow: 3">8</div>
      <div class="box-item">9</div>
      <div class="box-item" style="flex-grow: 1">10</div>
    </div>
    flex-shrink
    <div class="box">
      <div class="box-item" style="flex-shrink: 2">1</div>
      <div class="box-item">2</div>
      <div class="box-item">3</div>
      <div class="box-item">4</div>
      <div class="box-item">5</div>
      <div class="box-item">6</div>
      <div class="box-item" style="flex-shrink: 1">7</div>
      <div class="box-item" style="flex-shrink: 0.8">8</div>
      <div class="box-item">9</div>
      <div class="box-item" style="flex-shrink: 0">10</div>
    </div>

    flex-basis
    <div class="box">
      <div class="box-item" style="flex-basis:2rem">1</div>
      <div class="box-item">2</div>
    </div>
    align-self
    <div class="box" style="align-items:flex-start;height: 2rem">
      <div class="box-item">1</div>
      <div class="box-item" style="align-self: flex-end">2</div>
      <div class="box-item">3</div>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'

  export default {
    name: 'Flex',
    components: {
      PageHeader
    },
    data() {
      return {}
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
  .box {
    background: #88499c;
    display: flex;
    .box-item {
      width: 1.2rem;
      height: 1.2rem;
      display: inline-block;
      background: orange;
      line-height: 1.2rem;
      color: #fff;
      margin: 0.2rem;
    }
  }
</style>
