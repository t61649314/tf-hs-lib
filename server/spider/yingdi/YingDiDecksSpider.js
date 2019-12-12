const utils = require("../../utils/utils");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../../storage');
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
    let list = require(`../../../storage/other/${type}/report/list`);
    return co(function* () {
      for (let i = 0; i < yingDiDecksInfoList.length; i++) {
        let reportName = yingDiDecksInfoList[i].name;
        let url = `https://www.iyingdi.com/hearthstone/set/${yingDiDecksInfoList[i].id}/decks?token=&page=0&size=100`;
        try {
          console.info(`${url}开始读取`);
          const exist = !!list.find(item => {
            return item.name === reportName;
          });
          let {deckList, time} = yield _this.readDecks(url);
          if (!exist) {
            let reportContent = {};
            list.unshift({
              "name": reportName,
              "time": time,
              "fromUrl": `https://www.iyingdi.com/web/tools/hearthstone/decks/setdetail?btypes=home_allset&setid=${yingDiDecksInfoList[i].id}`
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
              console.info(`剩余：${deckList.length - j - 1}`);
            }
            yield utils.writeFile(path.join(rootDir, type, "deck", `${reportName}.json`), JSON.stringify(reportContent));
            yield utils.writeFile(path.join(rootDir, type, "report", "list.json"), JSON.stringify(list));
          } else {
            let reportContent = require(`../../../storage/other/wild/deck/${reportName}.json`);
            for (let j = 0; j < deckList.length; j++) {
              let findDeck = false;
              let item = deckList[j];
              Object.keys(reportContent).forEach(key => {
                let occupationItem = reportContent[key];
                if (occupationItem.find(occupationDeckItem => occupationDeckItem.code === item.code)) {
                  findDeck = true;
                }
              });
              if (!findDeck) {
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
                console.info(`${reportName} ${item.name} new`)
              } else {
                console.warn(`${reportName} ${item.name} done`)
              }
            }
            yield utils.writeFile(path.join(rootDir, type, "deck", `${reportName}.json`), JSON.stringify(reportContent));
          }
          console.info(`${url} done`);
        } catch (e) {
          console.error(`${url}:${e}`);
          break;
        }
      }
    });
  }
}

// const yingDiDecksInfoList = [
//   {id: 871123, name: "GetMeowth的46套狂野卡组推荐"}
// ];
const yingDiDecksInfoList = [
  {id: 894643, name: "【旅法师营地】【狂野】巨龙降临卡组速递"}
];
let yingDiDecksSpider = new YingDiDecksSpider();
yingDiDecksSpider.run("wild", yingDiDecksInfoList);
module.exports = YingDiDecksSpider;
