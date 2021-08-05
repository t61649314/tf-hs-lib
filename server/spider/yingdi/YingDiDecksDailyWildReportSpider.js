const utils = require("../../utils/utils");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../../storage');
const YingDiArticleSpider = require("./YingDiArticleSpider");
const co = require('co');
let rootDir = path.join(storagePath, "yingdi-daily-wild-report");

class YingDiDecksDailyWildReportSpider {
  static readHomePage(url, data) {
    return utils.postForm(url, data).then((data) => {
      return JSON.parse(data).items;
    });
  }

  run() {
    let _this = this;
    let list = require(`../../../storage/yingdi-daily-wild-report/wild/report/list`);
    return co(function* () {
      let body = {
        page: 1,
        search_type: 1,
        size: 10
      };
      let articleList1 = yield YingDiDecksDailyWildReportSpider.readHomePage("https://api.iyingdi.com/web/search/list", {
        timestamp: 1620141028,
        search_string: "营地炉石狂野日报"
        , sign: "3b7b985cfe4e7187a4b87d5753cb711b",
        ...body
      });
      let articleList2 = yield YingDiDecksDailyWildReportSpider.readHomePage("https://api.iyingdi.com/web/search/list", {
        timestamp: 1620141061,
        search_string: "营地狂野外服特辑】 第",
        sign: "e730c74ef5354df238396c6da59a87c3",
        ...body
      });
      let articleList = [...articleList1, ...articleList2].filter(({title}) => {
        title = title.replace(new RegExp("<em>", "g"), "").replace(new RegExp("</em>", "g"), "");
        return title.indexOf("营地炉石狂野日报") > -1 || title.indexOf("营地狂野外服特辑】 第") > -1 || title.indexOf("营地狂野外服特辑】第") > -1
      });
      for (let i = 0; i < articleList.length; i++) {
        let reportName = articleList[i].title.replace(new RegExp("<em>", "g"), "").replace(new RegExp("</em>", "g"), "").replace(new RegExp("（更新中）", "g"), "");
        let articleUrl = `https://www.iyingdi.com/tz/post/${articleList[i].source_id}`;
        try {
          console.info(`${articleUrl}开始读取`);
          const exist = !!list.find(item => {
            return item.name === reportName.replace("&", "和");
          });
          if (!exist) {
            let deckIdList = yield YingDiArticleSpider.readTzPost(articleUrl);
            let reportContent = {};
            list.unshift({
              "name": reportName,
              "time": articleList[i].created * 1000,
              "fromUrl": articleUrl
            });
            for (let j = 0; j < deckIdList.length; j++) {
              let deckId = deckIdList[j];
              let {deck} =yield YingDiArticleSpider.readDeckDetails(`https://api2.iyingdi.com/hearthstone/deck/${deckId}?token=&id=${deckId}&format=json`);
              //通过code调用ts的接口获取卡组信息
              let {cards, occupation} = utils.getCardInfoByCode(deck.code);
              // 构建dir对象
              if (!reportContent[occupation]) {
                reportContent[occupation] = [];
              }
              reportContent[occupation].push({
                name: deck.name,
                cards: cards,
                code: deck.code,
                alreadyFormatName: true
              });
              console.info(`该篇周报剩余：${deckIdList.length - j - 1}`);
            }
            yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
            yield utils.writeFile(path.join(rootDir, "wild", "report", "list.json"), JSON.stringify(list));
          }
          console.info(`${articleUrl} done`);
        } catch (e) {
          console.error(`${articleUrl}:${e}`);
        }
      }
    });
  }
}

module.exports = YingDiDecksDailyWildReportSpider;
