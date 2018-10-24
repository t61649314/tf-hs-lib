<template>
  <div>
    <page-header title="卡组列表"></page-header>
    <div class="list">
      <div class="deck-item" v-for="(value ,key) in obj" :key="key">
        <div class="deck-info-box">
          {{formatDeckName(value.name)}}
        </div>
        <div class="card-box">
          <div class="card-item clearfix" v-for="(value ,key) in value.cards.slice().sort(cardsSort)" :key="key">
            <div class="fl card-cost">{{value.cost}}</div>
            <div class="fl card-name">{{value.cnName}}</div>
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
  import deckZhCNJson from '../../server/zhCN/deckZhCNJson'

  export default {
    name: 'DeckList',
    components: {
      PageHeader
    },
    data() {
      return {
        obj: require(`../../storage/${this.$route.query.type}/dir.json`)[this.$route.query.page][this.$route.query.occupation],
      }
    },
    methods: {
      cardsSort(a, b) {
        return a.cost - b.cost
      },
      formatDeckName(name) {
        let formatName = "";
        name.split(" ").forEach(item => {
          if (deckZhCNJson[item]) {
            formatName += deckZhCNJson[item];
          } else {
            formatName += item + " ";
          }
        });
        return formatName;
      }
    }
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
      background: #1b1b1b;
      color: #fff;
      font-size: 0.3rem;
      font-weight: bold;
      text-align: left;
      padding: 0.3rem;
      box-sizing: border-box;
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

  @media screen and (min-width: 960px) {
    .list {
      text-align: left;
    }

    .deck-item {
      width: 200px;
      display: inline-block;
      padding: 20px;
      .deck-info-box {
        width: 100%;
        font-size: 14px;
        padding: 15px;
      }
      .card-box {
        width: 100%;
        font-size: 12px;
        .card-item {
          height: 25px;
          line-height: 25px;
          .card-img {
            height: 25px;
          }
          .card-quantity {
            width: 25px;
            text-align: center;
          }
          .card-cost {
            width: 25px;
            text-align: center;
          }
          .card-name {
            left: 35px;
          }
        }
      }
      button{
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
    }
  }
</style>
