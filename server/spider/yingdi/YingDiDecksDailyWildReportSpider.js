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
        return data.list.map(item => {
          return {
            title: item.title,
            id: item.sourceId
          }
        });
      }
    });
  }

  run() {
    let _this = this;
    let list = require(`../../../storage/yingdi-daily-wild-report/wild/report/list`);
    return co(function* () {
      let url1 = "https://www.iyingdi.com/common/search?version=820&type=feed&key=%E8%90%A5%E5%9C%B0%E7%8B%82%E9%87%8E%E5%A4%96%E6%9C%8D%E7%89%B9%E8%BE%91%E3%80%91+%E7%AC%AC&page=0&size=10";
      let url2 = "https://www.iyingdi.com/common/search?version=820&type=feed&key=%E8%90%A5%E5%9C%B0%E7%82%89%E7%9F%B3%E7%8B%82%E9%87%8E%E6%97%A5%E6%8A%A5&page=0&size=10";
      let articleList1 = yield YingDiDecksDailyWildReportSpider.readHomePage(url1);
      let articleList2 = yield YingDiDecksDailyWildReportSpider.readHomePage(url2);
      let articleList = [...articleList1, ...articleList2];
      for (let i = 0; i < articleList.length; i++) {
        let reportName = articleList[i].title.replace(new RegExp("<em>","g"), "").replace(new RegExp("</em>","g"), "");;

        let articleUrl = `https://www.iyingdi.com/article/${articleList[i].id}?time=1547867333211&token=0d27fe4a9a834c3abcff23a7caf6f0ec&system=web/`;
        try {
          console.info(`${articleUrl}开始读取`);
          const exist = !!list.find(item => {
            return item.name === reportName.replace("&", "和");
          });
          if (!exist) {
            let deckList,time;
            let res = yield YingDiArticleSpider.readArticle(articleUrl);
            deckList=res.deckList;
            time=res.time;
            if(!deckList.length){
              articleUrl = `https://www.iyingdi.com/bbsplus/comment/list/post?postId=${articleList[i].id}&token=&system=web&page=0`;
              res = yield YingDiArticleSpider.readArticle(articleUrl,true);
              deckList=res.deckList;
              time=res.time;
              if(!deckList.length){
                continue
              }
            }
            let reportContent = {};
            list.unshift({
              "name": reportName,
              "time": time,
              "fromUrl": `https://www.iyingdi.com/web/article/search/${articleList[i].id}`
            });
            for (let j = 0; j < deckList.length; j++) {
              if(deckList[j].code==="AAEBAf0EHooBwAGrBOYE9w3DFoK0Aum6Ati7AtDBApjEAsPqAv3qAs7vAtKJA9aZA5+bA+KbA/+dA6WhA/yjA5KkA7+kA7ulA/2sA+yvA7i2A8W4A/e4A8PMAwAA"){
                continue
              }
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
