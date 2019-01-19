const utils = require("../utils/utils");
const Const = require("./const.js");
const path = require("path");
const moment = require("moment");
const storagePath = path.resolve(__dirname, '../../storage');
const cardZhCNJson = require("../../server/zhCN/cardZhCNJson.json");
const Deckcode = require("../utils/deckcode/Deckcode");
const co = require('co');
let rootDir = path.join(storagePath, "shengerkuangye");
const homePageSearchId = [68573, 60767, 58190, 56065, 52702, 51596, 50430, 49165, 47149, 44758, 43020, 42204];

class ShengErKuangYe {
  readArticle(url) {
    return utils.startRequest(url, false, true).then((res) => {
      let {created, content} = res.article;
      let contentObj = JSON.parse(content);
      return {
        deckList: contentObj.filter(item => {
          return item.type === "deckCode";
        }).map(item => {
          return {
            name: item.deckname,
            code: item.code
          }
        }),
        time: created * 1000
      };
    })
  }

  run() {
    let _this = this;
    let list = require("../../storage/shengerkuangye/wild/report/list");
    return co(function* () {
      for (let i = 0; i < homePageSearchId.length; i++) {
        let reportName = `生而狂野战报第${homePageSearchId.length - i}期`;
        let url = `https://www.iyingdi.com/article/${homePageSearchId[i]}?time=1547867333211&token=0d27fe4a9a834c3abcff23a7caf6f0ec&system=web/`;
        try {
          console.info(`${url}开始读取`);
          const exist = !!list.find(item => {
            return item.name === reportName;
          });
          if (!exist) {
            let {deckList, time} = yield _this.readArticle(url);
            let reportContent = {};
            list.unshift({
              "name": reportName,
              "time": time,
              "fromUrl": `https://www.iyingdi.com/web/article/search/${homePageSearchId[i]}`
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
          console.info(`${url} done`);
        } catch (e) {
          console.error(`${url}:${e}`);
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
          cnName: cardZhCNJson[item.dbfId],
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

new ShengErKuangYe().run();
module.exports = ShengErKuangYe;
