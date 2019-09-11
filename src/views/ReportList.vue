<template>
  <div>
    <page-header :title="$route.query.name"></page-header>
    <div class="list">
      <div v-for="(item,index) in reportGroup" :key="index" class="item-box">
        <a class="item" v-if="item.jumpUrl" target="_blank" :href="item.jumpUrl">
          <span class="has-time-title">{{item.name}}</span>
          <span class="time-text">{{formatTime(item.time)}}</span>
        </a>
        <router-link class="item" v-else-if="item.name"
                     :to="{path:'/OccupationList', query:{page:item.name,form:$route.query.form,type:$route.query.type,time:item.time}}">
          <span class="has-time-title">{{item.name}}</span>
          <span class="new-icon" v-if="isNew(item.time)">new!</span>
          <span class="time-text">{{formatTime(item.time)}}</span>
        </router-link>
        <div v-else class="time-node-text">
          <div class="title" v-html="item.title"></div>
          <div class="time">{{item.time}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PageHeader from '../components/PageHeader.vue'
  import moment from 'moment'
  import {timeNode} from '../../server/spider/const'
  import {Indicator} from 'mint-ui'
  import axios from 'axios'

  export default {
    name: 'TempoStorm',
    components: {
      PageHeader
    },
    data() {
      return {
        typeTitleMap: {"wild": "狂野", "standard": "标准"},
        reportList: [],
        timeNode: timeNode
      }
    },
    computed: {
      reportGroup() {
        if (this.reportList && this.reportList.length) {
          let reportList = this.reportList.filter(item => {
            return !item.jumpUrl;   //todo 暂时取消78期之前的内容，直接跳转还是不太好，之后有时间自己弄吧
          }).sort((a, b) => {
            return b.time - a.time
          });
          let lastTime = reportList[reportList.length - 1].time;
          let reportGroup = reportList.concat(timeNode).sort((a, b) => {
            return new Date(b.time).getTime() - new Date(a.time).getTime()
          });
          return reportGroup.filter((item, index) => {
            if (item.name) {
              return true;
            } else {
              return new Date(reportGroup[index].time).getTime() > lastTime || new Date(reportGroup[index - 1].time).getTime() === lastTime
            }
          })
        } else {
          return [];
        }
      }
    },
    created: function () {
      this.init();
    },
    methods: {
      isNew: function (time) {
        let now = moment();
        return now.diff(moment(time), 'days') <= 3;
      },
      init: function () {
        Indicator.open();
        if (this.$route.query.type === 'wild') {
          axios.get(`/my-h5-page/storage/${this.$route.query.form}/wild/report/list.json`).then(({data}) => {
            Indicator.close();
            if (data) {
              this.reportList = data;
            }
          })
        } else {
          let newPromise = axios.get(`/my-h5-page/storage/${this.$route.query.form}/standard/report/newest-list.json`);
          let oldPromise = axios.get(`/my-h5-page/storage/${this.$route.query.form}/standard/report/old-list.json`);
          Promise.all([newPromise, oldPromise]).then(([{data: newestList}, {data: oldList}]) => {
            Indicator.close();
            if (newestList && oldList) {
              this.reportList = newestList.concat(oldList);
            }
          })
        }
        // if (this.$route.query.type === 'wild') {
        //   this.reportList = require(`../../storage/${this.$route.query.form}/wild/report/list.json`)
        // } else {
        //   this.reportList = require(`../../storage/${this.$route.query.form}/standard/report/newest-list.json`).concat(require(`../../storage/${this.$route.query.form}/standard/report/old-list.json`))
        // }
      },
      formatTime(time) {
        return moment(time).format("YYYY-MM-DD")
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .item-box {
    &:first-child {
      border-top: 0.01rem solid #ddd;
    }
    .item {
      &:first-child {
        border-top: initial;
      }
      .has-time-title {
        position: relative;
        top: -0.1rem;
      }
      .new-icon {
        position: relative;
        top: -0.2rem;
        color: red;
        font-style: italic;
      }
      .time-text {
        position: absolute;
        bottom: 0.1rem;
        left: 0.32rem;
        font-size: 0.28rem;
        color: #919191;
      }
    }
    .time-node-text {
      border-bottom: 0.01rem solid #ddd;
      text-align: left;
      padding: 0.08rem 0.32rem;
      background-color: #f5f5f5;
      color: #919191;
      .time {
        color: #919191;
      }
    }
  }

</style>
