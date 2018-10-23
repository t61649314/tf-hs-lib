<template>
  <div class="tempostorm">
    <page-header title="Tempostorm"></page-header>
    <div class="list">
      <div class="deck-item" v-for="(value ,key) in obj" :key="key">
        <div class="deck-info-box">
          {{value.name}}
        </div>
        <div class="card-box">
          <div class="card-item clearfix" v-for="(value ,key) in value.cards" :key="key">
            <div class="fl card-cost">{{value.cost}}</div>
            <div class="fl card-name">{{value.name}}</div>
            <div class="fr card-quantity">
              <i v-if="value.rarity==='Legendary'" class="fa fa-star"></i>
              <span v-else>{{value.quantity}}</span>
            </div>
            <img class="fr card-img" :src="`https://cdn.tempostorm.com/cards/${value.img}`"/>
          </div>
        </div>
        <button class="btn clipboard-btn" :data-clipboard-text="value.code">复制卡组</button>
      </div>
    </div>
  </div>
</template>
<script>
  import PageHeader from '../components/PageHeader.vue'
  import dirs from '../../storage/tempo-storm/dir.json'

  export default {
    name: 'TempostormDetails',
    components: {
      PageHeader
    },
    data() {
      return {
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
    .deck-info-box {
      width: 4.5rem;
      margin: auto;
      height: 0.8rem;
      background: #1b1b1b;
      color: #fff;
      line-height: 0.8rem;
      font-size: 0.3rem;
      font-weight: bold;
    }
    .card-box {
      width: 4.5rem;
      margin: auto;
      .card-item {
        height: 0.5rem;
        line-height: 0.5rem;
        background-color: #1b1b1b;
        color: #ddd;
        border-top: 1px solid rgba(0, 0, 0, .3);
        border-bottom: 1px solid rgba(255, 255, 255, .1);
        position: relative;
        .card-img {
          height: 0.5rem;
        }
        .card-quantity {
          width: 0.5rem;
          color: #fba31b;
          font-weight: 700;
        }
        .card-cost {
          color: #fff;
          width: 0.5rem;
          background-color: #2766ad;
          font-weight: 700;
        }
        .card-name {
          position: absolute;
          left: 0.7rem;
        }
      }
    }
  }
</style>
