const utils = require("../../utils/utils");
const Const = require("../const.js");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../../storage');
const cardZhCNJson = require("../../zhCN/cardZhCNJson.json");
const Deckcode = require("../../utils/deckcode/Deckcode");
const YingDiArticleSpider = require("./YingDiArticleSpider");
const co = require('co');
let rootDir = path.join(storagePath, "yingdi-daily-wild-report");

class YingDiDecksDailyWildReportSpider {
  static readHomePage(url) {
    return utils.startRequest(url, false, true).then((data) => {
      if (data.success) {
        return data.list.filter(item => {
          return item.title.indexOf("狂野") > -1
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
      let url = "https://www.iyingdi.com/article/opensearch?page=0&q=%E8%90%A5%E5%9C%B0%E7%82%89%E7%9F%B3%E7%8B%82%E9%87%8E%E6%97%A5%E6%8A%A5&size=100&visible=1";
      console.info(`${url}开始读取`);
      let articleList = yield YingDiDecksDailyWildReportSpider.readHomePage(url);

      for (let i = 0; i < articleList.length; i++) {
        let reportName = articleList[i].title;

        let articleUrl = `https://www.iyingdi.com/article/${articleList[i].id}?time=1547867333211&token=0d27fe4a9a834c3abcff23a7caf6f0ec&system=web/`;
        try {
          console.info(`${articleUrl}开始读取`);
          const exist = !!list.find(item => {
            return item.name === reportName;
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
              let {cards, occupation} = yield _this.getCardInfoByCode(deckList[j].code);
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

  getCardInfoByCode(code) {
    let deckFromCode = new Deckcode().getDeckFromCode(code);
    let occupationInfo = Const.occupationInfo;
    let occupationId = deckFromCode.heroes[0].id;
    let occupation = Object.keys(occupationInfo).find(item => {
      return occupationInfo[item].dbfId.includes(occupationId);
    });
    const params = {
      "where": {
        "dbfId": {
          "inq": deckFromCode.cards.map(item => {
            return item.id
          })
        },
        "deckable": true,
        "isActive": true
      },
      "fields": ["id", "name", "cost", "rarity", "playerClass", "dust", "mechanics", "cardType", "deckable", "expansion", "isActive", "photoNames", "isTriClass", "triClasses", "isHallOfFame", "dbfId"],
      "sort": ["cost", "name"],
      "limit": 30
    };
    const getPageDateUrl = `https://tempostorm.com/api/cards?filter=${JSON.stringify(params)}`;
    return utils.startRequest(encodeURI(getPageDateUrl), false, true).then(json => {
      let arr = [];
      json.forEach(item => {
        arr.push({
          dbfId: item.dbfId,
          name: item.name,
          cnName: cardZhCNJson[item.dbfId].cnName,
          cardSet: cardZhCNJson[item.dbfId].cardSet,
          img: item.photoNames.small,
          quantity: deckFromCode.cards.find(deckFromCodeItem => {
            return deckFromCodeItem.id === item.dbfId
          }).count,
          rarity: item.rarity,//Legendary
          cost: item.cost
        });
      });
      return {
        cards: arr,
        occupation: occupation
      };
    })
  }
}

module.exports = YingDiDecksDailyWildReportSpider;
