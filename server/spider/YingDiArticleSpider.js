const utils = require("../utils/utils");
const Const = require("./const.js");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../storage');
const cardZhCNJson = require("../../server/zhCN/cardZhCNJson.json");
const Deckcode = require("../utils/deckcode/Deckcode");
const co = require('co');


class YingDiArticleSpider {
  readArticle(url) {
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

  run(keyWord, cnName, articleIdList, onlyOne) {
    let _this = this;
    let rootDir = path.join(storagePath, keyWord);
    let list = require(`../../storage/${keyWord}/wild/report/list`);
    return co(function* () {
      for (let i = 0; i < articleIdList.length; i++) {
        let reportName;
        if (onlyOne) {
          reportName = cnName;
        } else {
          reportName = `${cnName}第${articleIdList.length - i}期`;
        }

        let url = `https://www.iyingdi.com/article/${articleIdList[i]}?time=1547867333211&token=0d27fe4a9a834c3abcff23a7caf6f0ec&system=web/`;
        try {
          console.info(`${url}开始读取`);
          const exist = !!list.find(item => {
            return item.name === reportName;
          });
          if (!exist) {
            let {deckList, time} = yield _this.readArticle(url);
            let reportContent = {};
            list.unshift({
              "name": reportName,
              "time": time,
              "fromUrl": `https://www.iyingdi.com/web/article/search/${articleIdList[i]}`
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
              console.info(`该篇周报剩余：${deckList.length - j - 1}`);
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
    let occupationInfo = Const.occupationInfo;
    let occupationId = deckFromCode.heroes[0].id;
    let occupation = Object.keys(occupationInfo).find(item => {
      return occupationInfo[item].dbfId.includes(occupationId);
    });
    if(!occupation){
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

const shengerkuangyeArticleIdList = [75317,72307,68573, 60767, 58190, 56065, 52702, 51596, 50430, 49165, 47149, 44758, 43020, 42204];
const fengtianArticleIdList = [71751,69619];
const zaowuzheArticleIdList = [70829, 67497, 64253];
const suzhijichaArticleIdList = [76281,74671,67565];
const other1 = [62865];
const other2 = [60747];
const other3 = [73839];
let yingDiArticleSpider = new YingDiArticleSpider();
// yingDiArticleSpider.run("other", "【旅法师营地】暗影崛起卡组速报", other3, true);
// yingDiArticleSpider.run("other", "【旅法师营地】十月狂野传说指南——天下武功唯快不破", other1, true);
// yingDiArticleSpider.run("other", "【旅法师营地】狂野的新挑战者们", other2, true);
// yingDiArticleSpider.run("zaowuzhe", "造物者狂野战报", zaowuzheArticleIdList);
yingDiArticleSpider.run("suzhijicha", "素质极差狂野战报", suzhijichaArticleIdList);
// yingDiArticleSpider.run("shengerkuangye", "生而狂野战报", shengerkuangyeArticleIdList);
// yingDiArticleSpider.run("fengtian", "奉天战队狂野战报", fengtianArticleIdList);
module.exports = YingDiArticleSpider;
