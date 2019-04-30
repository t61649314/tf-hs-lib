const utils = require("../utils/utils");
const Const = require("./const.js");
const path = require("path");
const moment = require("moment");
const storagePath = path.resolve(__dirname, '../../storage');
const cardZhCNJson = require("../../server/zhCN/cardZhCNJson.json");
const Deckcode = require("../utils/deckcode/Deckcode");
const co = require('co');
const otherCode = require('./otherCode');
let rootDir = path.join(storagePath, "hearthstone-top-decks");

class HearthstoneTopDecksSpider {
  readChildPage(url) {
    return utils.startRequest(url).then(($) => {
      console.info(`${url}读取成功`);
      const attachmentMediumDom = $('.deck-code');
      if (attachmentMediumDom.length) {
        const code = attachmentMediumDom.attr("value");
        return {
          code: code,
        };
      } else {
        console.info(`${url}：no data`);
      }
    })
  }

  readHomePage(url) {
    return utils.startRequest(url).then(($) => {
      console.info(`${url}读取成功`);
      const deckHrefList = $('.blog-box-2');
      if (deckHrefList.length) {
        let hrefList = [];
        deckHrefList.each(function () {
          const href = $(this).find(".blog-title").attr("href");
          const name = $(this).find(".blog-title").html();
          const time = $(this).find(".entry-date").attr("datetime");
          hrefList.push({
            href: href,
            name: name,
            time: time
          });
        });
        return hrefList;
      } else {
        throw new Error("not found deck href list");
      }
    })
  }

  getLastStandardPageUrl() {
    const homeUrl = `https://teamrankstar.com/category/hearthstone/`;
    const titleReg = /^Permanent Link to Hearthstone Wild Meta Snapshot –.*$/;
    return utils.startRequest(homeUrl).then(($) => {
      let titles = $("article.format-standard").find("header").find("a");
      let reportUrl;
      titles.each(function () {
        let title = $(this).attr("title");
        let href = $(this).attr("href");
        if (titleReg.test(title)) {
          reportUrl = href;
          return false;
        }
      });
      return reportUrl;
    })
  }

  run() {
    let _this = this;
    let list = require("../../storage/hearthstone-top-decks/wild/report/list");
    return co(function* () {
      try {
        for (let i = 1; ; i++) {
          let url;
          if (i === 1) {
            url = 'https://hearthstone-decks.net/wild-decks/';
          } else {
            url = `https://hearthstone-decks.net/wild-decks/page/${i}/`;
          }
          console.info(`${url}开始读取`);
          let hrefList = yield _this.readHomePage(url);
          for (let j = 0; j < hrefList.length; j++) {
            let item = hrefList[j];
            let timeStr = moment(item.time).format("YYYY-MM-DD");

            let report = {
              "name": timeStr,
              "time": new Date(item.time).getTime(),
              "fromUrl": 'https://hearthstone-decks.net/wild-decks/'
            };
            let findReport = list.find(item => item.name === timeStr);
            let reportContent;
            if (findReport) {
              reportContent = require(`../../storage/hearthstone-top-decks/wild/deck/${timeStr}.json`);
              let findDeck = false;
              Object.keys(reportContent).forEach(key => {
                let occupationItem = reportContent[key];
                if (occupationItem.find(occupationDeckItem => occupationDeckItem.name === item.name)) {
                  findDeck = true;
                }
              });
              if (!findDeck) {
                console.info(`${item.href}开始读取`);
                let deckInfo = yield _this.readChildPage(item.href);
                if (deckInfo) {
                  let {cards, occupation} = yield _this.getCardInfoByCode(deckInfo.code);
                  if (!reportContent[occupation]) {
                    reportContent[occupation] = [];
                  }
                  reportContent[occupation].push({name: item.name, cards: cards, code: deckInfo.code});
                  yield utils.writeFile(path.join(rootDir, "wild", "deck", `${timeStr}.json`), JSON.stringify(reportContent));
                }
                console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
              } else {
                throw new Error(`HearthstoneTopDecks 无最新内容`);
              }
            } else {
              reportContent = {};
              console.info(`${item.href}开始读取`);
              let deckInfo = yield _this.readChildPage(item.href);
              if (deckInfo.code === "AAAEBAQcIhRfTxQLD6gKS+AKe+ALx/AKggAOblAMLS6IE+Af/B4KtApvCAqLHAo77Ap77AvWAA5eUAwA=") {
                deckInfo.code = "AAEBAQcInhCFF/i/AtPFAsPqAp74AqCAA5uUAwtLogT4B/8Hgq0Cm8ICoscCjvsCnvsC9YADl5QDAA==";
              }
              if (deckInfo) {
                let {cards, occupation} = yield _this.getCardInfoByCode(deckInfo.code);
                if (!reportContent[occupation]) {
                  reportContent[occupation] = [];
                }
                reportContent[occupation].push({name: item.name, cards: cards, code: deckInfo.code});
                yield utils.writeFile(path.join(rootDir, "wild", "deck", `${timeStr}.json`), JSON.stringify(reportContent));
              }
              console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
              list.unshift(report);
              yield utils.writeFile(path.join(rootDir, "wild", "report", "list.json"), JSON.stringify(list));
            }
          }
          console.info(`${url} done`);
        }
      } catch (e) {
        console.error(`${e}`);
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
    if (!occupation) {
      console.warn(`not find this occupation : ${occupationId}`)
    }
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

module.exports = HearthstoneTopDecksSpider;
