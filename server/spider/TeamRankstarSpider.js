const utils = require("../utils/utils");
const Const = require("./const.js");
const path = require("path");
const moment = require("moment");
const otherCode = require("./otherCode");
const storagePath = path.resolve(__dirname, '../../storage');
const cardZhCNJson = require("../../server/zhCN/cardZhCNJson.json");
const Deckcode = require("../utils/deckcode/Deckcode");
const co = require('co');
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
      const hrefDomList = $('.has-text-color:not(.has-medium-font-size)');
      const time = $("meta[property='article:published_time']").attr("content");
      let hrefList = [];
      hrefDomList.each(function () {
        let code = $(this).next().html();
        let name;
        if ($(this).find("strong").find("a").length) {
          name = $(this).find("strong").find("a").html();
        } else {
          name = $(this).find("strong").html();
        }
        if (name && name.indexOf("Tier 0") === -1 &&
          name.indexOf("Tier 5") === -1 &&
          name.indexOf("Tier 1") === -1 &&
          name.indexOf("Tier 2") === -1 &&
          name.indexOf("Tier 3") === -1 &&
          name.indexOf("Tier 4") === -1 &&
          code.indexOf("Ranked") === -1) {
          hrefList.push({
            code: code,
            name: name
          })
        }
      });
      return {
        time: new Date(time).getTime(),
        hrefList: hrefList,
      };
    })
  }

  getLastStandardPageUrl() {
    const homeUrl = `https://teamrankstar.com/category/hearthstone/`;
    return utils.startRequest(homeUrl).then(($) => {
      let titles = $(".elementor-post__title").find("a");
      let reportUrl;
      titles.each(function () {
        let title = $(this).html();
        let href = $(this).attr("href");
        if (title.indexOf("Hearthstone Wild Meta Snapshot") > -1) {
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
      if (!url) {
        console.info("TeamRankstar无最新内容");
        return false;
      }
      let reportName = url.split("/")[4].replace("hearthstone-wild-meta-snapshot-", "team-rankstar-");
      const exist = !!list.find(item => {
        return item.name === reportName;
      });
      if (exist) {
        console.info("TeamRankstar无最新内容");
      } else {
        let {hrefList, time} = yield _this.readHomePage(url);
        let reportContent;
        try {
          reportContent = require(`../../storage/team-rankstar/wild/deck/${reportName}`);
        } catch (e) {
          reportContent = {};
        }
        list.unshift({"name": reportName, "time": time, "fromUrl": url});
        for (let j = 0; j < hrefList.length; j++) {
          console.info(`${hrefList[j].name}开始读取`);
          if (_this.checkExits(reportContent, hrefList[j].name)) {
            continue;
          }
          let {cards, occupation} = yield _this.getCardInfoByCode(hrefList[j].code);
          //构建dir对象
          if (!reportContent[occupation]) {
            reportContent[occupation] = [];
          }
          //通过code调用ts的接口获取卡组信息
          reportContent[occupation].push({name: hrefList[j].name, cards: cards, code: hrefList[j].code});
          console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
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
