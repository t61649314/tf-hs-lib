const utils = require("../utils/utils");
const Const = require("./const.js");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../storage');
const cardZhCNJson = require("../../server/zhCN/cardZhCNJson.json");
const Deckcode = require("../utils/deckcode/Deckcode");
const co = require('co');
const tinify = require("tinify");
tinify.key = "f348cyVw8EYflrQ0esvr3IZ0xQwdsRBr";
let rootDir = path.join(storagePath, "vicious-syndicate");

class ViciousSyndicateSpider {
  readChildPage(url) {
    return new Promise((resolve, reject) => {
      utils.startRequest(url).then(($) => {
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
          resolve({
            name: name,
            imgUrl: imgUrl,
            code: code,
            occupation: occupation,
          })
        } else {
          console.info(`${url}：no data`);
          resolve(null);
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  readHomePage(url) {
    return new Promise((resolve, reject) => {
      utils.startRequest(url).then(($) => {
        console.info(`${url}读取成功`);
        const deckHrefList = $('.tag-analysis').children('.entry-content').children('ul').find("a");
        if (deckHrefList.length) {
          let hrefList = [];
          deckHrefList.each(function () {
            const href = $(this).attr("href");
            if (href) {
              hrefList.push(href);
            }
          });
          resolve(hrefList);
        } else {
          reject("not found deck href list");
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  getLastStandardPageUrl() {
    const homeUrl = `https://www.vicioussyndicate.com/`;
    const standardTitleReg = /^(vS Data Reaper Report #){1}\d{3}$/;
    return new Promise((resolve, reject) => {
      utils.startRequest(homeUrl).then(($) => {
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
        resolve(reportUrl);
      }).catch(err => {
        reject(err);
      });
    });
  }

  runStandard() {
    let _this = this;
    let dir = require("../../storage/vicious-syndicate/standard-dir.json");
    return co(function* () {
      let url = yield _this.getLastStandardPageUrl();
      let itemName = url.split("/")[3];
      if (dir[itemName]) {
        console.info("VS标准无最新内容");
      } else {
        dir = {};
        let hrefList = yield _this.readHomePage(url);
        dir[itemName] = {};
        for (let j = 0; j < hrefList.length; j++) {
          console.info(`${hrefList[j]}开始读取`);
          let deckInfo = yield _this.readChildPage(hrefList[j]);
          if (deckInfo) {
            //构建dir对象
            if (!dir[itemName][deckInfo.occupation]) {
              dir[itemName][deckInfo.occupation] = [];
            }
            //通过code调用ts的接口获取卡组信息
            let cards = yield _this.getCardInfoByCode(deckInfo.code);
            dir[itemName][deckInfo.occupation].push({name: deckInfo.name, cards: cards, code: deckInfo.code});
          }
          console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
        }
        yield utils.writeFile(path.join(rootDir, `standard-dir.json`), JSON.stringify(dir));
      }
      console.info(`${url} done`);
    });
  }

  runWild() {
    let _this = this;
    let dir = require("../../storage/vicious-syndicate/wild-dir.json");
    return co(function* () {
      for (let i = 1; ; i++) {
        let itemName = `wild-vs-data-reaper-report-${i}`;
        // let itemDir = path.join(rootDir, itemName);
        let url = `https://www.vicioussyndicate.com/${itemName}/`;
        try {
          console.info(`${url}开始读取`);
          if (!dir[itemName]) {
            let hrefList = yield _this.readHomePage(url);
            dir[itemName] = {};
            for (let j = 0; j < hrefList.length; j++) {
              console.info(`${hrefList[j]}开始读取`);
              let deckInfo = yield _this.readChildPage(hrefList[j]);

              //构建dir对象
              if (!dir[itemName][deckInfo.occupation]) {
                dir[itemName][deckInfo.occupation] = [];
              }
              //通过code调用ts的接口获取卡组信息
              let cards = yield _this.getCardInfoByCode(deckInfo.code);
              dir[itemName][deckInfo.occupation].push({name: deckInfo.name, cards: cards, code: deckInfo.code});
              yield utils.writeFile(path.join(rootDir, `wild-dir.json`), JSON.stringify(dir));

              //---------------------------------已经舍弃的图片方案----------------------------------------
              //定义文件夹路径和文件路径
              // const fileDir = path.join(itemDir, deckInfo.occupation);
              // const filePath = path.join(fileDir, `${deckInfo.name}.png`);
              // //创建文件夹
              // yield utils.makeDirs(fileDir);
              //
              // //判断文件是否存在
              // const isExists = yield utils.existsFile(filePath);
              // if (isExists) {
              //   console.info(`${deckInfo.name}.png已经存在，跳过下载`);
              // } else {
              //   //tinify读取图片
              //   try {
              //     console.info(`${deckInfo.name}.png开始写入`);
              //     const source = tinify.fromUrl(encodeURI(deckInfo.imgUrl));
              //     yield source.toFile(filePath);
              //     console.info(`${deckInfo.name}.png写入成功`);
              //   } catch (e) {
              //     console.error(e);
              //     console.error(`${deckInfo.name}.png写入失败`);
              //     console.error(`imgUrl：${deckInfo.imgUrl}`);
              //   }
              // }
              //---------------------------------已经舍弃的图片方案----------------------------------------
              console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
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
    return new Promise((resolve, reject) => {
      utils.startRequest(encodeURI(getPageDateUrl), false, true).then(json => {
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
        resolve(arr);
      }).catch(err => {
        reject(err);
      });
    });
  }
}

module.exports = ViciousSyndicateSpider;
