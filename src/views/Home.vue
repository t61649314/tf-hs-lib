<template>
  <div class="home">
    <page-header title="TF套牌库" noBack="true"></page-header>
    <mt-navbar v-model="selected">
      <mt-tab-item id="1">狂野模式</mt-tab-item>
      <mt-tab-item id="2">标准模式</mt-tab-item>
    </mt-navbar>
    <div class="list" :class="selected==='1'?'wild-list':'standard-list'">
      <router-link class="item"
                   :to="{path:'/ReportList', query:{type:selected==='1'?'wild':'standard',form:'vicious-syndicate',name:'VS战报'}}">
        <div class="type-icon"></div>
        VS战报
      </router-link>
      <router-link class="item"
                   :to="{path:'/ReportList', query:{type:selected==='1'?'wild':'standard',form:'tempo-storm',name:'TS战报'}}">
        <div class="type-icon"></div>
        TS战报
      </router-link>
      <router-link class="item"  v-if="selected==='1'"
                   :to="{path:'/ReportList', query:{type:'wild',form:'hearthstone-top-decks',name:'Hearthstone Top Decks'}}">
        <div class="type-icon"></div>
        Hearthstone Top Decks
      </router-link>
      <router-link class="item"  v-if="selected==='1'"
                   :to="{path:'/ReportList', query:{type:'wild',form:'team-rankstar',name:'TeamRankstar战报'}}">
        <div class="type-icon"></div>
        TeamRankstar战报
      </router-link>
      <router-link class="item" v-if="selected==='1'"
                   :to="{path:'/ReportList', query:{type:'wild',form:'suzhijicha',name:'素质极差狂野战报'}}">
        <div class="type-icon"></div>
        素质极差狂野战报
      </router-link>
      <router-link class="item" v-if="selected==='1'"
                   :to="{path:'/ReportList', query:{type:'wild',form:'shengerkuangye',name:'生而狂野战报'}}">
        <div class="type-icon"></div>
        生而狂野战报
      </router-link>
      <router-link class="item" v-if="selected==='1'"
                   :to="{path:'/ReportList', query:{type:'wild',form:'fengtian',name:'奉天狂野战报'}}">
        <div class="type-icon"></div>
        奉天狂野战报
      </router-link>
      <router-link class="item" v-if="selected==='1'"
                   :to="{path:'/ReportList', query:{type:'wild',form:'zaowuzhe',name:'造物者狂野战报'}}">
        <div class="type-icon"></div>
        造物者狂野战报
      </router-link>
      <router-link class="item" v-if="selected==='1'"
                   :to="{path:'/ReportList', query:{type:'wild',form:'nga-carry',name:'NGA搬运'}}">
        <div class="type-icon"></div>
        NGA搬运
      </router-link>
      <router-link class="item" v-if="selected==='1'"
                   :to="{path:'/ReportList', query:{type:'wild',form:'other',name:'其他'}}">
        <div class="type-icon"></div>
        其他
      </router-link>
      <div class="mini-code-content">
        <p>更多新功能，更流畅请体验小程序版：</p>
        <img src="../assets/img/mini-code.jpg">
      </div>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'
  import Const from '../../server/spider/const.js'

  export default {
    name: 'Home',
    components: {
      PageHeader
    },
    watch: {
      selected: function (val) {
        localStorage.setItem("selected", val);
      },
    },
    data() {
      return {
        Const: Const,
        selected: localStorage.getItem("selected") || '1'
      }
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
