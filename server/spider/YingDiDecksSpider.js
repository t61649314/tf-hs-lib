const utils = require("../utils/utils");
const Const = require("./const.js");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../storage');
const cardZhCNJson = require("../../server/zhCN/cardZhCNJson.json");
const Deckcode = require("../utils/deckcode/Deckcode");
const co = require('co');


class YingDiDecksSpider {
  readDecks(url) {
    return utils.startRequest(url, false, true).then((res) => {
      return {
        deckList: res.list.map(item => {
          return {
            name: item.deck.name,
            code: item.deck.code
          }
        }),
        time: res.list[0].deck.created * 1000
      };
    })
  }

  run(type, yingDiDecksInfoList) {
    let _this = this;
    let rootDir = path.join(storagePath, "other");
    let list = require(`../../storage/other/${type}/report/list`);
    return co(function* () {
      for (let i = 0; i < yingDiDecksInfoList.length; i++) {
        let reportName = yingDiDecksInfoList[i].name;
        let url = `https://www.iyingdi.com/hearthstone/set/${yingDiDecksInfoList[i].id}/decks?token=&page=0&size=100`;
        try {
          console.info(`${url}开始读取`);
          const exist = !!list.find(item => {
            return item.name === reportName;
          });
          if (!exist) {
            let {deckList, time} = yield _this.readDecks(url);
            let reportContent = {};
            list.unshift({
              "name": reportName,
              "time": time,
              "fromUrl": `https://www.iyingdi.com/web/tools/hearthstone/decks/setdetail?btypes=home_allset&setid=${yingDiDecksInfoList[i].id}`
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
              console.info(`剩余：${deckList.length - j - 1}`);
            }
            yield utils.writeFile(path.join(rootDir, type, "deck", `${reportName}.json`), JSON.stringify(reportContent));
            yield utils.writeFile(path.join(rootDir, type, "report", "list.json"), JSON.stringify(list));
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

const yingDiDecksInfoList = [
  {id: 871123, name: "GetMeowth的46套狂野卡组推荐"}
];
let yingDiDecksSpider = new YingDiDecksSpider();
yingDiDecksSpider.run("wild", yingDiDecksInfoList);
module.exports = YingDiDecksSpider;
