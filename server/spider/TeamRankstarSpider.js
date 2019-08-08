const utils = require("../utils/utils");
const Const = require("./const.js");
const path = require("path");
const moment = require("moment");
const storagePath = path.resolve(__dirname, '../../storage');
const cardZhCNJson = require("../../server/zhCN/cardZhCNJson.json");
const Deckcode = require("../utils/deckcode/Deckcode");
const co = require('co');
const otherCode = require('./otherCode');
let rootDir = path.join(storagePath, "team-rankstar");

class TeamRankstarSpider {
  readChildPage(url) {
    return utils.startRequest(url).then(($) => {
      console.info(`${url}读取成功`);
      const attachmentMediumDom = $('#deck-code');
      if (attachmentMediumDom.length) {
        const code = attachmentMediumDom.attr("data-deck-code");
        return {
          code: code,
        };
      } else {
        console.info(`${url}：no data`);
      }
    })
  }

  readOtherChildPage(url) {
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
      const deckHrefList = $('a');
      const tier34DeckDomList = $('.has-text-color:not(.has-medium-font-size)');
      const time = $("meta[property='article:published_time']").attr("content");
      if (deckHrefList.length) {
        let hrefList = [];
        let otherHrefList = [];
        let tier34DeckList = [];
        deckHrefList.each(function () {
          const href = $(this).attr("href");
          const name = $(this).html();
          if (href && href.indexOf("https://www.hearthstonetopdecks.com/decks/") > -1) {
            hrefList.push({
              name: name,
              href: href
            });
          } else if (href && href.indexOf("https://hearthstone-decks.net/") > -1) {
            otherHrefList.push({
              name: name,
              href: href
            });
          }
        });
        tier34DeckDomList.each(function () {
          const code = $(this).next().html();
          let name;
          if ($(this).find("strong").find("a").length) {
            name = $(this).find("strong").find("a").html();
          } else {
            name = $(this).find("strong").html();
          }
          if (name.indexOf("Tier 1") === -1 &&
            name.indexOf("Tier 2") === -1 &&
            name.indexOf("Tier 3") === -1 &&
            name.indexOf("Tier 4") === -1) {
            tier34DeckList.push({
              code: code,
              name: name
            })
          }
        });
        return {
          time: new Date(time).getTime(),
          tier34DeckList: tier34DeckList,
          hrefList: hrefList,
          otherHrefList: otherHrefList
        };
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

  checkExits(reportContent, name) {
    let flag = false;
    Object.keys(reportContent).forEach(key => {
      if (reportContent[key].find(item => item.name === name)) {
        flag = true;
      }
    });
    return flag;
  }

  run() {
    let _this = this;
    let list = require("../../storage/team-rankstar/wild/report/list");
    return co(function* () {
      let url = yield _this.getLastStandardPageUrl();
      if(!url){
        console.info("TeamRankstar无最新内容");
        return false;
      }
      let reportName = url.split("/")[3].replace("hearthstone-wild-meta-snapshot-", "team-rankstar-");
      const exist = !!list.find(item => {
        return item.name === reportName;
      });
      if (exist) {
        console.info("TeamRankstar无最新内容");
      } else {
        let {hrefList, otherHrefList, time, tier34DeckList} = yield _this.readHomePage(url);
        let reportContent = require(`../../storage/team-rankstar/wild/deck/${reportName}`);
        list.unshift({"name": reportName, "time": time, "fromUrl": url});
        for (let j = 0; j < tier34DeckList.length; j++) {
          console.info(`${tier34DeckList[j].name}开始读取`);
          if (_this.checkExits(reportContent, tier34DeckList[j].name)) {
            continue;
          }
          let {cards, occupation} = yield _this.getCardInfoByCode(tier34DeckList[j].code);
          //构建dir对象
          if (!reportContent[occupation]) {
            reportContent[occupation] = [];
          }
          //通过code调用ts的接口获取卡组信息
          reportContent[occupation].push({name: tier34DeckList[j].name, cards: cards, code: tier34DeckList[j].code});
          console.info(`该篇周报T34剩余：${tier34DeckList.length - j - 1}`);
          yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
        }
        for (let j = 0; j < hrefList.length; j++) {
          console.info(`${hrefList[j].href}开始读取`);
          if (_this.checkExits(reportContent, hrefList[j].name)) {
            continue;
          }
          let deckInfo = yield _this.readChildPage(hrefList[j].href);
          if (deckInfo) {
            let {cards, occupation} = yield _this.getCardInfoByCode(deckInfo.code);
            //构建dir对象
            if (!reportContent[occupation]) {
              reportContent[occupation] = [];
            }
            //通过code调用ts的接口获取卡组信息
            reportContent[occupation].push({name: hrefList[j].name, cards: cards, code: deckInfo.code});
          }
          console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
          yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
        }
        for (let j = 0; j < otherHrefList.length; j++) {
          console.info(`${otherHrefList[j].href}开始读取`);
          if (_this.checkExits(reportContent, otherHrefList[j].name)) {
            continue;
          }
          let deckInfo = yield _this.readOtherChildPage(otherHrefList[j].href);
          if (deckInfo) {
            let {cards, occupation} = yield _this.getCardInfoByCode(deckInfo.code);
            //构建dir对象
            if (!reportContent[occupation]) {
              reportContent[occupation] = [];
            }
            //通过code调用ts的接口获取卡组信息
            reportContent[occupation].push({name: otherHrefList[j].name, cards: cards, code: deckInfo.code});
          }
          console.info(`该篇周报Other剩余：${otherHrefList.length - j - 1}`);
          yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
        }
        let otherCodeList = otherCode[reportName];
        if (otherCodeList) {
          for (let j = 0; j < otherCodeList.length; j++) {
            console.info(`${otherCodeList[j].name}开始读取`);
            if (_this.checkExits(reportContent, otherCodeList[j].name)) {
              continue;
            }
            let {cards, occupation} = yield _this.getCardInfoByCode(otherCodeList[j].code);
            //构建dir对象
            if (!reportContent[occupation]) {
              reportContent[occupation] = [];
            }
            //通过code调用ts的接口获取卡组信息
            reportContent[occupation].push({name: otherCodeList[j].name, cards: cards, code: otherCodeList[j].code});
            console.info(`该篇周报其他code剩余：${otherCodeList.length - j - 1}`);
            yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
          }
        }

        yield utils.writeFile(path.join(rootDir, "wild", "report", "list.json"), JSON.stringify(list));
        console.info(`${url} done`);
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

module.exports = TeamRankstarSpider;
