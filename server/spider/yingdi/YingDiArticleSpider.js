const utils = require("../../utils/utils");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../../storage');
const co = require('co');
const cheerio = require('cheerio');

class YingDiArticleSpider {
  static readTzPost(url) {
    return utils.startRequest(url, false).then(($) => {
      console.info(`${url}读取成功`);
      const deckListDom = $('.yingdi-deck');
      if (deckListDom && deckListDom.length) {
        let deckIdList = [];
        deckListDom.each(function () {
          deckIdList.push($(this).find(".deck-link").attr("data-id"))
        });
        return deckIdList;
      } else {
        console.info(`${url}：no data`);
      }
    })
  }

  static readDeckDetails(url) {
    return utils.startRequest(url, false, true).then((res) => {
      return res
    })
  }

  run(keyWord, cnName, articleIdList, onlyOne, canRefresh, bbsplus) {
    let _this = this;
    let rootDir = path.join(storagePath, keyWord);
    let list = require(`../../../storage/${keyWord}/wild/report/list`);
    return co(function* () {
      for (let i = 0; i < articleIdList.length; i++) {
        if (articleIdList[i] === 0) {
          continue
        }
        let reportName;
        if (onlyOne) {
          reportName = cnName;
        } else {
          reportName = `${cnName}第${articleIdList.length - i}期`;
        }
        let url = `https://www.iyingdi.com/tz/post/${articleIdList[i]}`;
        try {
          console.info(`${url}开始读取`);
          const exist = !!list.find(item => {
            return item.name === reportName;
          });
          let deckIdList = yield YingDiArticleSpider.readTzPost(url);
          if (!exist) {
            let reportContent = {};
            list.unshift({
              "name": reportName,
              "time": new Date("2021-05-10").getTime(),
              "fromUrl": url
            });
            for (let j = 0; j < deckIdList.length; j++) {
              let deckId = deckIdList[j];
              YingDiArticleSpider.readDeckDetails(`https://api2.iyingdi.com/hearthstone/deck/${deckId}?token=&id=${deckId}&format=json`);
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
                alreadyFormatName: !!deckList[j].name
              });
              console.info(`该篇周报剩余：${deckList.length - j - 1}`);
            }
            yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
            yield utils.writeFile(path.join(rootDir, "wild", "report", "list.json"), JSON.stringify(list));
          } else if (canRefresh) {
            let reportContent = require(`../../../storage/${keyWord}/wild/deck/${reportName}.json`);
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
                let {cards, occupation} = utils.getCardInfoByCode(deckList[j].code);
                if (!reportContent[occupation]) {
                  reportContent[occupation] = [];
                }
                reportContent[occupation].push({
                  name: deckList[j].name,
                  cards: cards,
                  code: deckList[j].code,
                  alreadyFormatName: !bbsplus
                });
                console.info(`${reportName} ${item.name} new`)
              } else {
                console.warn(`${reportName} ${item.name} done`)
              }
            }
            yield utils.writeFile(path.join(rootDir, "wild", "deck", `${reportName}.json`), JSON.stringify(reportContent));
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

const shengerkuangyeArticleIdList = [75317, 72307, 68573, 60767, 58190, 56065, 52702, 51596, 50430, 49165, 47149, 44758, 43020, 42204];
const yuebangArticleIdList = [2334748];
const fengtianArticleIdList = [71751, 69619];
const zaowuzheArticleIdList = [80753, 78627, 70829, 67497, 64253];
const suzhijichaArticleIdList = [109364, 2305496, 101923, 96311, 85163, 78225, 76281, 74671, 67565];
const lajiArticleIdList = [88815, 84583];
const qianjinsiArticleIdList = [5022407, 109335, 107739, 106233, 0, 105279, 101655];
let yingDiArticleSpider = new YingDiArticleSpider();
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】疯狂的暗月马戏团卡组速递（第二天）", [2320381], true,true,true);
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】疯狂的暗月马戏团卡组速递（第一天）", [2319759], true,true,true);
// yingDiArticleSpider.run("yingdi-daily-wild-report", "【咕咕·营地狂野外服特辑】第27期", [2319548], true,true,true);
// yingDiArticleSpider.run("other", "【狂野环境报】虎牙和雾都狂野环境报第二期", [106268], true);
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】通灵学园卡组速递（第一天）", [2287418], true, true, true);
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】通灵学园卡组速递（第二天）", [2288346], true, true, true);
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】通灵学园卡组速递（第三天）", [2289015], true, true, true);
// yingDiArticleSpider.run("other", "【旅法师营地】【虎牙&咕咕狂野战报】春树暮云#2", [102683], true, false, false);
// yingDiArticleSpider.run("other", "Alphacord狂野环境报告#3卡组", [2262172], true, false, true);
// yingDiArticleSpider.run("other", "【旅法师营地】外域的灰烬盗贼卡组与思路整合", [2240983], true, false, true);
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】外域的灰烬卡组速递（第二日）", [2214425], true, true, true);
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】外域的灰烬卡组速递（第一日）", [2210833], true, true, true);
// yingDiArticleSpider.run("laji", "狂野环境辣鸡战报", lajiArticleIdList);
// yingDiArticleSpider.run("qianjinsi", "前进四狂野环境报", qianjinsiArticleIdList);
// yingDiArticleSpider.run("qianjinsi", "前进四狂野环境报第3期", [2289613], true, false, true);
// yingDiArticleSpider.run("other", "虎牙和咕咕咕文案组狂野联合战报", [93623], true);
// yingDiArticleSpider.run("other", "【旅法师营地】魔都战队狂野上分卡组推荐合集", [96623], true, true);
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】奥丹姆奇兵卡组速递", [82391], true, true);
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】暗影崛起卡组速递", [73839], true, true);
// yingDiArticleSpider.run("other", "【旅法师营地】十月狂野传说指南——天下武功唯快不破", other1, true);
// yingDiArticleSpider.run("other", "【旅法师营地】狂野的新挑战者们", other2, true);
// yingDiArticleSpider.run("zaowuzhe", "造物者狂野战报", zaowuzheArticleIdList);
// yingDiArticleSpider.run("suzhijicha", "素质极差狂野战报", suzhijichaArticleIdList, false, false, false);
// yingDiArticleSpider.run("shengerkuangye", "生而狂野战报", shengerkuangyeArticleIdList);
// yingDiArticleSpider.run("fengtian", "奉天战队狂野战报", fengtianArticleIdList);
// yingDiArticleSpider.run("yuebang", "月榜群狂野战报", yuebangArticleIdList, false, false, true);
module.exports = YingDiArticleSpider;
