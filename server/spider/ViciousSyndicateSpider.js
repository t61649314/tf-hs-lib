const utils = require("../utils/utils");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../storage');
const co = require('co');
let rootDir = path.join(storagePath, "vicious-syndicate");

class ViciousSyndicateSpider {
  readChildPage(url) {
    return utils.startRequest(url).then(($) => {
      console.info(`${url}读取成功`);
      const nameDom = $('.entry-title');
      const codeDom = $('.copy-deck');
      if (nameDom.length && codeDom.length) {
        return {
          name: nameDom.text(),
          code: codeDom.attr("data-clipboard-text"),
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
          if (href && href.indexOf("www.vicioussyndicate.com") > -1 && href.indexOf("wild-vs-data-reaper-report") === -1 && href.indexOf("deck-library") === -1) {
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
      console.info(`${url}开始读取`);
      let {hrefList, time} = yield _this.readHomePage(url);
      let findReport = list.find(item => item.name === reportName);
      let reportContent;
      if (findReport) {
        reportContent = require(`../../storage/vicious-syndicate/standard/deck/${reportName}.json`);
        let count = 0;
        Object.keys(reportContent).forEach(key => {
          let occupationItem = reportContent[key];
          count += occupationItem.length;
        });
        for (let j = count; j < hrefList.length; j++) {
          console.info(`${hrefList[j]}开始读取`);
          try {
            let deckInfo = yield _this.readChildPage(hrefList[j]);
            if (deckInfo) {
              //通过code调用ts的接口获取卡组信息
              let {cards, occupation} = utils.getCardInfoByCode(deckInfo.code);
              //构建dir对象
              if (!reportContent[occupation]) {
                reportContent[occupation] = [];
              }
              reportContent[occupation].push({name: deckInfo.name, cards: cards, code: deckInfo.code});
            }
          } catch (e) {
            console.error(`${hrefList[j]}:${e}`);
            break;
          }
          console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
          yield utils.writeFile(path.join(rootDir, "standard", "deck", `${reportName}.json`), JSON.stringify(reportContent));
          yield utils.writeFile(path.join(rootDir, "standard", "report", "newest-list.json"), JSON.stringify(list));
        }
      } else {
        reportContent = {};
        list = [{
          "name": reportName,
          "time": time,
          "fromUrl": url
        }];
        for (let j = 0; j < hrefList.length; j++) {
          console.info(`${hrefList[j]}开始读取`);
          try {
            let deckInfo = yield _this.readChildPage(hrefList[j]);
            if (deckInfo) {
              //通过code调用ts的接口获取卡组信息
              let {cards, occupation} = utils.getCardInfoByCode(deckInfo.code);
              //构建dir对象
              if (!reportContent[occupation]) {
                reportContent[occupation] = [];
              }
              reportContent[occupation].push({name: deckInfo.name, cards: cards, code: deckInfo.code});
            }
          } catch (e) {
            console.error(`${hrefList[j]}:${e}`);
            break;
          }
          console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
          yield utils.writeFile(path.join(rootDir, "standard", "deck", `${reportName}.json`), JSON.stringify(reportContent));
          yield utils.writeFile(path.join(rootDir, "standard", "report", "newest-list.json"), JSON.stringify(list));
        }
      }
      console.info(`${url} done`);
    });
  }

  runWild() {
    let _this = this;
    let list = require("../../storage/vicious-syndicate/wild/report/list");
    return co(function* () {
      for (let i = list.length; ; i++) {
        let reportName = `wild-vs-data-reaper-report-${i}`;
        let url = `https://www.vicioussyndicate.com/${reportName}/`;
        try {
          console.info(`${url}开始读取`);
          let {hrefList, time} = yield _this.readHomePage(url);
          let findReport = list.find(item => item.name === reportName);
          let reportContent;
          if (findReport) {
            reportContent = require(`../../storage/vicious-syndicate/wild/deck/${reportName}.json`);
            let count = 0;
            Object.keys(reportContent).forEach(key => {
              let occupationItem = reportContent[key];
              count += occupationItem.length;
            });
            for (let j = count; j < hrefList.length; j++) {
              console.info(`${hrefList[j]}开始读取`);
              try {
                let deckInfo = yield _this.readChildPage(hrefList[j]);
                if (deckInfo) {
                  //通过code调用ts的接口获取卡组信息
                  let {cards, occupation} = utils.getCardInfoByCode(deckInfo.code);
                  //构建dir对象
                  if (!reportContent[occupation]) {
                    reportContent[occupation] = [];
                  }
                  reportContent[occupation].push({name: deckInfo.name, cards: cards, code: deckInfo.code});
                }
              } catch (e) {
                console.error(`${hrefList[j]}:${e}`);
                break;
              }
              console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
              yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
              yield utils.writeFile(path.join(rootDir, "wild", "report", "list.json"), JSON.stringify(list));
            }
          } else {
            reportContent = {};
            list.unshift({"name": reportName, "time": time, "fromUrl": url});
            for (let j = 0; j < hrefList.length; j++) {
              console.info(`${hrefList[j]}开始读取`);
              try {
                let deckInfo = yield _this.readChildPage(hrefList[j]);
                if (deckInfo) {
                  //通过code调用ts的接口获取卡组信息
                  let {cards, occupation} = utils.getCardInfoByCode(deckInfo.code);
                  //构建dir对象
                  if (!reportContent[occupation]) {
                    reportContent[occupation] = [];
                  }
                  reportContent[occupation].push({name: deckInfo.name, cards: cards, code: deckInfo.code});
                }
              } catch (e) {
                console.error(`${hrefList[j]}:${e}`);
                break;
              }
              console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
              yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
              yield utils.writeFile(path.join(rootDir, "wild", "report", "list.json"), JSON.stringify(list));
            }
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

module.exports = ViciousSyndicateSpider;
