const utils = require("../../utils/utils");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../../storage');
const YingDiArticleSpider = require("./YingDiArticleSpider");
const co = require('co');
let rootDir = path.join(storagePath, "yingdi-daily-wild-report");

class YingDiDecksDailyWildReportSpider {
  static readHomePage(url) {
    return utils.startRequest(url, false, true).then((data) => {
      if (data.success) {
        return data.list.filter(item => {
          return item.title.indexOf("狂野日报") > -1 || item.title.indexOf("狂野外服特辑") > -1
        }).map(item => {
          return {
            title: item.title,
            id: item.id
          }
        });
      }
    });
  }

  run() {
    let _this = this;
    let list = require(`../../../storage/yingdi-daily-wild-report/wild/report/list`);
    return co(function* () {
      let url1 = "https://www.iyingdi.com/article/opensearch?q=%E8%90%A5%E5%9C%B0%E7%8B%82%E9%87%8E%E5%A4%96%E6%9C%8D&size=10&visible=1&page=0";
      let url2 = "https://www.iyingdi.com/article/opensearch?q=%E8%90%A5%E5%9C%B0%E7%8B%82%E9%87%8E%E6%97%A5%E6%8A%A5&size=10&visible=1&page=0";
      let articleList1 = yield YingDiDecksDailyWildReportSpider.readHomePage(url1);
      let articleList2 = yield YingDiDecksDailyWildReportSpider.readHomePage(url2);
      let articleList = [...articleList1, ...articleList2];
      for (let i = 0; i < articleList.length; i++) {
        let reportName = articleList[i].title;

        let articleUrl = `https://www.iyingdi.com/article/${articleList[i].id}?time=1547867333211&token=0d27fe4a9a834c3abcff23a7caf6f0ec&system=web/`;
        try {
          console.info(`${articleUrl}开始读取`);
          const exist = !!list.find(item => {
            return item.name === reportName.replace("&", "和");
          });
          if (!exist) {
            let {deckList, time} = yield YingDiArticleSpider.readArticle(articleUrl);
            let reportContent = {};
            list.unshift({
              "name": reportName,
              "time": time,
              "fromUrl": `https://www.iyingdi.com/web/article/search/${articleList[i].id}`
            });
            for (let j = 0; j < deckList.length; j++) {
              //通过code调用ts的接口获取卡组信息
              let {cards, occupation} = utils.getCardInfoByCode(deckList[j].code);
              // 构建dir对象
              if (!reportContent[occupation]) {
                reportContent[occupation] = [];
              }
              reportContent[occupation].push({
                name: deckList[j].name,
                cards: cards,
                code: deckList[j].code,
                alreadyFormatName: true
              });
              console.info(`该篇周报剩余：${deckList.length - j - 1}`);
            }
            yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
            yield utils.writeFile(path.join(rootDir, "wild", "report", "list.json"), JSON.stringify(list));
          }
          console.info(`${articleUrl} done`);
        } catch (e) {
          console.error(`${articleUrl}:${e}`);
          break;
        }
      }
    });
  }
}

module.exports = YingDiDecksDailyWildReportSpider;
