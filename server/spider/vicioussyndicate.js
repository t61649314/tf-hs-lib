const utils = require("../utils/utils");
const Const = require("./const.js");
const path = require("path");
const moment = require("moment");
const storagePath = path.resolve(__dirname, '../../storage');
const cardZhCNJson = require("../../server/zhCN/cardZhCNJson.json");
const Deckcode = require("../utils/deckcode/Deckcode");
const co = require('co');
let rootDir = path.join(storagePath, "vicious-syndicate");

class ViciousSyndicateSpider {
  readChildPage(url) {
    return utils.startRequest(url).then(($) => {
      console.info(`${url}读取成功`);
      const attachmentMediumDom = $('.attachment-medium');
      if (attachmentMediumDom.length) {
        const name = attachmentMediumDom.attr("alt");
        const imgUrl = attachmentMediumDom.attr("data-cfsrc");
        const code = attachmentMediumDom.parent().parent().next().attr("data-clipboard-text");
        let occupation = "Other";
        Object.keys(Const.occupationInfo).forEach(item => {
          if (name.indexOf(item) > -1) {
            occupation = item;
            return false;
          }
        });
        return {
          name: name,
          imgUrl: imgUrl,
          code: code,
          occupation: occupation,
        };
      } else {
        console.info(`${url}：no data`);
      }
    })
  }

  readHomePage(url) {
    return utils.startRequest(url).then(($) => {
      console.info(`${url}读取成功`);
      const deckHrefList = $('.tag-analysis').children('.entry-content').find('ul').find("a");
      const time = $("meta[property='article:published_time']").attr("content");
      if (deckHrefList.length) {
        let hrefList = [];
        deckHrefList.each(function () {
          const href = $(this).attr("href");
          if (href && href.indexOf("www.vicioussyndicate.com") > -1) {
            hrefList.push(href);
          }
        });
        return {
          time: new Date(time).getTime(),
          hrefList: hrefList
        };
      } else {
        throw new Error("not found deck href list");
      }
    })
  }

  getLastStandardPageUrl() {
    const homeUrl = `https://www.vicioussyndicate.com/`;
    const standardTitleReg = /^(vS Data Reaper Report #){1}\d{3}$/;
    return utils.startRequest(homeUrl).then(($) => {
      let titles = $(".mh-posts-grid-title,.mh-custom-posts-xl-title").find("a");
      let reportUrl;
      titles.each(function () {
        let title = $(this).attr("title");
        let href = $(this).attr("href");
        if (standardTitleReg.test(title)) {
          reportUrl = href;
          return false;
        }
      });
      return reportUrl;
    })
  }

  runStandard() {
    let _this = this;
    let list = require("../../storage/vicious-syndicate/standard/report/newest-list");
    return co(function* () {
      let url = yield _this.getLastStandardPageUrl();
      let reportName = url.split("/")[3];
      const exist = !!list.find(item => {
        return item.name === reportName;
      });
      if (exist) {
        console.info("VS标准无最新内容");
      } else {
        let {hrefList, time} = yield _this.readHomePage(url);
        let reportContent = {};
        list = [{
          "name": reportName,
          "time": time,
          "fromUrl": url
        }];
        for (let j = 0; j < hrefList.length; j++) {
          console.info(`${hrefList[j]}开始读取`);
          let deckInfo = yield _this.readChildPage(hrefList[j]);
          if (deckInfo) {
            //构建dir对象
            if (!reportContent[deckInfo.occupation]) {
              reportContent[deckInfo.occupation] = [];
            }
            //通过code调用ts的接口获取卡组信息
            let cards = yield _this.getCardInfoByCode(deckInfo.code);
            reportContent[deckInfo.occupation].push({name: deckInfo.name, cards: cards, code: deckInfo.code});
          }
          console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
        }
        yield utils.writeFile(path.join(rootDir, "standard", "deck", `${reportName}.json`), JSON.stringify(reportContent));
        yield utils.writeFile(path.join(rootDir, "standard", "report", "newest-list.json"), JSON.stringify(list));
      }
      console.info(`${url} done`);
    });
  }

  runWild() {
    let _this = this;
    let list = require("../../storage/vicious-syndicate/wild/report/list");
    return co(function* () {
      for (let i = 1; ; i++) {
        let reportName = `wild-vs-data-reaper-report-${i}`;
        let url = `https://www.vicioussyndicate.com/${reportName}/`;
        try {
          console.info(`${url}开始读取`);
          const exist = !!list.find(item => {
            return item.name === reportName;
          });
          if (!exist) {
            let {hrefList, time} = yield _this.readHomePage(url);
            let reportContent = {};
            list.unshift({"name": reportName, "time": time, "fromUrl": url});
            for (let j = 0; j < hrefList.length; j++) {
              console.info(`${hrefList[j]}开始读取`);
              let deckInfo = yield _this.readChildPage(hrefList[j]);
              if (deckInfo) {
                //构建dir对象
                if (!reportContent[deckInfo.occupation]) {
                  reportContent[deckInfo.occupation] = [];
                }
                //VS有些卡组code是空的
                // if (hrefList[j] === 'https://www.vicioussyndicate.com/odd-rogue-2/') {
                //   deckInfo.code = "AAEBAYO6AgavBPoOkbwCyssC/eoCnvgCDIwCqAXUBd0I8xG6E5sVkrYCgcIC68IC0eECpu8CAA==";
                // }
                //通过code调用ts的接口获取卡组信息
                let cards = yield _this.getCardInfoByCode(deckInfo.code);
                reportContent[deckInfo.occupation].push({name: deckInfo.name, cards: cards, code: deckInfo.code});
              }
              console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
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
      return arr;
    })
  }
}

module.exports = ViciousSyndicateSpider;
