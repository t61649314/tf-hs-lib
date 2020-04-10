const utils = require("../../utils/utils");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../../storage');
const co = require('co');


class YingDiArticleSpider {
  static readArticle(url) {
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

  run(keyWord, cnName, articleIdList, onlyOne, canRefresh) {
    let _this = this;
    let rootDir = path.join(storagePath, keyWord);
    let list = require(`../../../storage/${keyWord}/wild/report/list`);
    return co(function* () {
      for (let i = 0; i < articleIdList.length; i++) {
        let reportName;
        if (onlyOne) {
          reportName = cnName;
        } else {
          reportName = `${cnName}第${articleIdList.length - i}期`;
        }
        let url = `https://www.iyingdi.com/article/${articleIdList[i]}?time=${new Date().getTime()}&system=web&remark=seed`;
        // let url = `https://www.iyingdi.com/bbsplus/comment/list/post?postId=${articleIdList[i]}&token=23fad3cd67cf45c5b2bb84c5d9efb2fa&system=web&size=10&page=0&voteFaction=-1&_=1586495614993`;
        try {
          console.info(`${url}开始读取`);
          const exist = !!list.find(item => {
            return item.name === reportName;
          });
          let {deckList, time} = yield YingDiArticleSpider.readArticle(url);
          if (!exist) {
            let reportContent = {};
            list.unshift({
              "name": reportName,
              "time": time,
              "fromUrl": `https://www.iyingdi.com/web/article/search/${articleIdList[i]}`
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
                  alreadyFormatName: true
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
const fengtianArticleIdList = [71751, 69619];
const zaowuzheArticleIdList = [80753, 78627, 70829, 67497, 64253];
const suzhijichaArticleIdList = [96311,85163, 78225, 76281, 74671, 67565];
const lajiArticleIdList = [88815, 84583];
let yingDiArticleSpider = new YingDiArticleSpider();
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】外域的灰烬卡组速递（第二日）", [2214425], true, true);
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】外域的灰烬卡组速递（第一日）", [2210833], true, true);
// yingDiArticleSpider.run("laji", "狂野环境辣鸡战报", lajiArticleIdList);
// yingDiArticleSpider.run("other", "虎牙和咕咕咕文案组狂野联合战报", [93623], true);
// yingDiArticleSpider.run("other", "【旅法师营地】魔都战队狂野上分卡组推荐合集", [96623], true, true);
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】奥丹姆奇兵卡组速递", [82391], true, true);
// yingDiArticleSpider.run("other", "【旅法师营地】【狂野】暗影崛起卡组速递", [73839], true, true);
// yingDiArticleSpider.run("other", "【旅法师营地】十月狂野传说指南——天下武功唯快不破", other1, true);
// yingDiArticleSpider.run("other", "【旅法师营地】狂野的新挑战者们", other2, true);
// yingDiArticleSpider.run("zaowuzhe", "造物者狂野战报", zaowuzheArticleIdList);
// yingDiArticleSpider.run("suzhijicha", "素质极差狂野战报", suzhijichaArticleIdList);
// yingDiArticleSpider.run("shengerkuangye", "生而狂野战报", shengerkuangyeArticleIdList);
// yingDiArticleSpider.run("fengtian", "奉天战队狂野战报", fengtianArticleIdList);
module.exports = YingDiArticleSpider;
