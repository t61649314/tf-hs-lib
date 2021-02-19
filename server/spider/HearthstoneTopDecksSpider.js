const utils = require("../utils/utils");
const path = require("path");
const moment = require("moment");
const storagePath = path.resolve(__dirname, '../../storage');
const co = require('co');
let rootDir = path.join(storagePath, "hearthstone-top-decks");

class HearthstoneTopDecksSpider {
  readChildPage(url) {
    return utils.startRequest(url).then(($) => {
      console.info(`${url}读取成功`);
      const attachmentMediumDom = $('#Code1');
      const attachmentMediumDom2 = $('#Code2');
      if (attachmentMediumDom2.length) {
        console.error(`${url}：code2！！！！！！！！！！！！！！！！！！！！！`);
      }
      if (attachmentMediumDom.length) {
        let code;
        if (url === "https://hearthstone-decks.net/mech-hand-buff-paladin-222-legend-darkseeker83/") {
          code = "AAEBAZ8FBKcFpfUCoIADn7cDDZQPhBCFEI4Qs7sC97wCn/UCmPsC1v4C1/4C2f4C4f4CzIEDAA==";
        } else {
          code = attachmentMediumDom.attr("value");
        }
        return {
          code: [code],
        };
      } else {
        console.info(`${url}：no data`);
      }
    })
  }

  readHomePage(url) {
    return utils.startRequest(url).then(($) => {
      console.info(`${url}读取成功`);
      const deckHrefList = $('.medium-content');
      if (deckHrefList.length) {
        let hrefList = [];
        deckHrefList.each(function () {
          const href = $(this).find(".entry-title").find("a").attr("href");
          const name = $(this).find(".entry-title").find("a").html();
          const time = $(this).find(".meta-date").html();
          hrefList.push({
            href: href,
            name: name,
            time: moment(new Date(time)).add(1, 'days')
          });
        });
        return hrefList;
      } else {
        throw new Error("not found deck href list");
      }
    })
  }

  run() {
    let _this = this;
    let list = require("../../storage/hearthstone-top-decks/wild/report/list");
    return co(function* () {

      for (let i = 1; ; i++) {
        if (i > 6) {
          break;
        }
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
          let reportName = "hearthstone-top-" + item.time.format("YYYY-MM-DD");

          let report = {
            "name": reportName,
            "time": item.time.valueOf(),
            "fromUrl": 'https://hearthstone-decks.net/wild-decks/'
          };
          let findReport = list.find(item => item.name === reportName);
          let reportContent;
          if (findReport) {
            reportContent = require(`../../storage/hearthstone-top-decks/wild/deck/${reportName}.json`);
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
                for (let i = 0; i < deckInfo.code.length; i++) {
                  try {
                    let {cards, occupation} = utils.getCardInfoByCode(deckInfo.code[i]);
                    if (!reportContent[occupation]) {
                      reportContent[occupation] = [];
                    }
                    reportContent[occupation].push({name: item.name, cards: cards, code: deckInfo.code[i]});
                    yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
                  } catch (e) {
                    console.error(`${e}`);
                  }
                }
              }
              console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
            } else {
              console.warn(`${reportName} ${item.name} done`)
            }
          } else {
            reportContent = {};
            console.info(`${item.href}开始读取`);
            let deckInfo = yield _this.readChildPage(item.href);
            if (deckInfo) {
              for (let i = 0; i < deckInfo.code.length; i++) {
                try {
                  let {cards, occupation} = utils.getCardInfoByCode(deckInfo.code[i]);
                  if (!reportContent[occupation]) {
                    reportContent[occupation] = [];
                  }
                  reportContent[occupation].push({name: item.name, cards: cards, code: deckInfo.code[i]});
                  yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
                } catch (e) {
                  console.error(`${e}`);
                }
              }
            }
            console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
            list.unshift(report);
            yield utils.writeFile(path.join(rootDir, "wild", "report", "list.json"), JSON.stringify(list));
          }
        }
        console.info(`${url} done`);
      }
    });
  }
}

module.exports = HearthstoneTopDecksSpider;
