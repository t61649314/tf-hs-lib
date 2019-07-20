<template>
  <div>
    <page-header :title="$route.query.page"></page-header>
    <div class="list" v-if="deckList&&deckList.length&&isInit">
      <div class="deck-item" v-for="(deckItem,index) in deckList" :key="index">
        <div class="deck-info-box" :occupation="occupation">
          <div class="occupation-icon"></div>
          <span class="deck-name-content">{{deckItem.alreadyFormatName?deckItem.name:formatDeckName(deckItem.name,deckItem.cards)}}{{deckItem.name}}</span>
        </div>
        <div class="card-box">
          <div class="card-item clearfix"
               v-for="(cardItem,index) in deckItem.cards.slice().sort(cardsSort)"
               :key="index">
            <div class="is-weaken-text" v-if="isWeaken(cardItem.dbfId)">已削弱</div>
            <div class="fl card-cost">{{cardItem.cost}}</div>
            <div class="fl card-name">{{cardItem.name}}{{cardItem.dbfId}}</div>
            <div class="fr card-quantity">
              <i v-if="cardItem.rarity==='Legendary'" class="fa fa-star"></i>
              <span v-else>{{cardItem.quantity}}</span>
            </div>
            <img class="fr card-img" :src="`https://cdn.tempostorm.com/cards/${cardItem.img}`"/>
          </div>
        </div>
        <button class="btn clipboard-btn" :data-clipboard-text="deckItem.code">复制卡组</button>
      </div>
    </div>
    <div class="no-data-content" v-else-if="isInit">
      暂无数据
    </div>
  </div>
</template>
<script>
  import PageHeader from '../components/PageHeader.vue'
  import {formatDeckName} from '../assets/utils'
  import moment from 'moment'
  import {timeNode} from '../../server/spider/const'
  import {Indicator} from 'mint-ui'
  import axios from 'axios'

  export default {
    name: 'DeckList',
    components: {
      PageHeader
    },
    data() {
      return {
        weakenArr: [],
        time: parseInt(this.$route.query.time),
        isInit: false,
        occupation: this.$route.query.occupation,
        deckList: [],
      }
    },
    created: function () {
      this.init();
    },
    methods: {
      init: function () {
        let weakenArr = timeNode.filter(item => {
          return moment(item.time).isAfter(moment(new Date(this.time))) && item.weakenCardArr;
        });
        weakenArr.forEach(item => {
          this.weakenArr = this.weakenArr.concat(item.weakenCardArr)
        });
        // Indicator.open();
        // axios.get(`/my-h5-page/storage/${this.$route.query.form}/${this.$route.query.type}/deck/${this.$route.query.page}.json`).then(({data}) => {
        //   Indicator.close();
        //   this.isInit = true;
        //   if (data) {
        //     this.deckList = data[this.occupation];
        //   }
        // })
        this.deckList = require(`../../storage/${this.$route.query.form}/${this.$route.query.type}/deck/${this.$route.query.page}.json`)[this.occupation];
        this.isInit = true;
      },
      cardsSort(a, b) {
        return a.cost - b.cost
      },
      formatDeckName(name, cards) {
        return formatDeckName(name, cards, this.occupation);
      },
      isWeaken(dbfId) {
        return this.weakenArr.includes(dbfId);
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
      padding: 0.2rem 0.3rem;
      box-sizing: border-box;
      word-break: break-all;
      display: flex;
      align-items: center;
      .deck-name-content {
        max-width: 3rem;
      }
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
          color: #fff;
        }
        .is-weaken-text {
          position: absolute;
          left: 4.7rem;
          color: #ff4545;
          word-break: keep-all;
          &:before {
            content: "";
            display: block;
            position: absolute;
            height: 0.04rem;
            background-color: #ff4545;
            top: 0;
            bottom: 0;
            left: -4.7rem;
            width: 4.5rem;
            margin: auto;
          }
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
      button {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
    }
  }
</style>
