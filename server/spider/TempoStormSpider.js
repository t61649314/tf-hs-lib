const _ = require("lodash");
const utils = require("../utils/utils");
const path = require("path");
const moment = require("moment");
const Const = require("./const.js");
const storagePath = path.resolve(__dirname, '../../storage');
const co = require('co');
const Deckcode = require("../utils/deckcode/Deckcode");
const Deck = require("../utils/deckcode/Deck");
const Card = require("../utils/deckcode/Card");
const Hero = require("../utils/deckcode/Hero");
const cardZhCNJson = require("../../server/zhCN/cardZhCNJson.json");
const FORMAT_WILD = 1;
const FORMAT_STANDARD = 2;
const rootDir = path.join(storagePath, "tempo-storm");

class TempoStormSpider {
  getCount(snapshotType) {
    const getCountUrl = `https://tempostorm.com/api/snapshots/count?where={"snapshotType":"${snapshotType}","isActive":true}`;
    return utils.startRequest(encodeURI(getCountUrl), false, true).then((json) => {
      return json.count;
    })
  }

  getPageSlug(page, snapshotType) {
    if(snapshotType==="standard"){
      page+=3;
    }else{
      page+=2;
    }
    const params = {
      "order": "createdDate+DESC",
      "fields": ["id", "snapshotType", "isActive", "publishDate"],
      "where": {
        "isActive": true,
        "publishDate": {"lte": new Date().toJSON()},
        "snapNum": page,
        "snapshotType": snapshotType
      },
      "include": [{"relation": "slugs"}]
    };
    const getPageDateUrl = `https://tempostorm.com/api/snapshots/findOne?filter=${JSON.stringify(params)}`;
    return utils.startRequest(encodeURI(getPageDateUrl), false, true).then((json) => {
      return json.slugs[0].slug;
    })
  }

  getDeckSlugList(slug, snapshotType) {
    const params = {
      "where": {"slug": slug, "snapshotType": snapshotType},
      "include": [{
        "relation": "comments",
        "scope": {
          "include": [{"relation": "author", "scope": {"fields": ["username", "gravatarUrl"]}}],
          "order": "createdDate+DESC"
        }
      }, {
        "relation": "deckMatchups",
        "scope": {
          "include": [{
            "relation": "forDeck",
            "scope": {"fields": ["name", "name_ru", "playerClass"]}
          }, {"relation": "againstDeck", "scope": {"fields": ["name", "name_ru", "playerClass"]}}]
        }
      }, {
        "relation": "deckTiers",
        "scope": {
          "include": [{
            "relation": "deck",
            "scope": {
              "fields": ["id", "name", "slug", "playerClass"],
              "include": {"relation": "slugs", "scope": {"fields": ["linked", "slug"]}}
            }
          }, {
            "relation": "deckTech",
            "scope": {
              "include": [{
                "relation": "cardTech",
                "scope": {"include": [{"relation": "card", "scope": {"fields": ["name", "name_ru", "photoNames"]}}]}
              }]
            }
          }]
        }
      }, {
        "relation": "authors",
        "scope": {"include": [{"relation": "user", "scope": {"fields": ["username", "social"]}}]}
      }, {"relation": "votes", "scope": {"fields": ["direction", "authorId"]}}, {
        "relation": "slugs",
        "scope": {"fields": ["linked", "slug"]}
      }]
    };
    const getPageDateUrl = `https://tempostorm.com/api/snapshots/findOne?filter=${JSON.stringify(params)}`;
    let arr = [];
    return utils.startRequest(encodeURI(getPageDateUrl), false, true).then(json => {
      json.deckTiers.forEach(item => {
        arr.push(item.deck.slugs[0].slug);
      });
      return {
        deckSlugList: arr,
        time: new Date(json.publishDate).getTime(),
      };
    })
  }

  getDeck(slug) {
    const params = {
      "where": {"slug": slug},
      "fields": ["id", "createdDate", "name", "name_ru", "description", "description_ru", "playerClass", "premium", "dust", "heroName", "authorId", "deckType", "isPublic", "chapters", "chapters_ru", "youtubeId", "gameModeType", "isActive", "isCommentable", "isMultilingual"],
      "include": [{
        "relation": "cards",
        "scope": {
          "include": "card",
          "scope": {"fields": ["id", "name", "name_ru", "cardType", "cost", "dust", "photoNames"]}
        }
      }, {
        "relation": "comments",
        "scope": {
          "fields": ["id", "votes", "voteScore", "authorId", "createdDate", "text"],
          "include": {"relation": "author", "scope": {"fields": ["id", "username", "gravatarUrl"]}},
          "order": "createdDate+DESC"
        }
      }, {"relation": "author", "scope": {"fields": ["id", "username", "gravatarUrl"]}}, {
        "relation": "matchups",
        "scope": {"fields": ["forChance", "deckName", "deckName_ru", "className"]}
      }, {"relation": "votes", "fields": ["id", "direction", "authorId"]}]
    };
    const getPageDateUrl = `https://tempostorm.com/api/decks/findOne?filter=${JSON.stringify(params)}`;
    let deck = {};
    let arr = [];
    return utils.startRequest(encodeURI(getPageDateUrl), false, true).then(json => {
      deck.name = json.description;
      deck.playerClass = json.playerClass;
      json.cards.forEach(item => {
        arr.push({
          dbfId: item.card.dbfId,
          name: item.card.name,
          img: item.card.photoNames.small,
          quantity: item.cardQuantity,
          rarity: item.card.rarity,//Legendary
          cost: item.card.cost
        });
      });
      deck.cards = arr;
      return deck;
    })
  }

  getDeckcode(deck) {
    let _deck = new Deck(FORMAT_WILD);
    _deck.addHero(new Hero(Const.occupationInfo[deck.playerClass].dbfId[0]));
    deck.cards.forEach(item => {
      _deck.addCard(new Card(item.dbfId, item.quantity));
    });
    let deckCode = new Deckcode();
    return deckCode.getCodeFromDeck(_deck);
  }

  build(count, deckSlugList, reportContent, list, reportName, type) {
    let _this = this;
    return co(function* () {
      for (let j = count; j < deckSlugList.length; j++) {
        console.info(`开始获取deck`);
        let deck = yield _this.getDeck(deckSlugList[j]);
        console.info(`获取deck成功：${JSON.stringify(deck)}`);

        //构建dir对象
        if (!reportContent[deck.playerClass]) {
          reportContent[deck.playerClass] = [];
        }
        deck.code = _this.getDeckcode(deck);
        deck.cards.forEach(item => {
          if(item.dbfId===9726){
            item.dbfId=59726
          }
          item.img2 = cardZhCNJson[item.dbfId].img;
          item.cnName = cardZhCNJson[item.dbfId].cnName;
          item.cardSet = cardZhCNJson[item.dbfId].cardSet;
        });
        reportContent[deck.playerClass].push(deck);
        yield utils.writeFile(path.join(rootDir, type, "deck", `${reportName}.json`), JSON.stringify(reportContent));
        yield utils.writeFile(path.join(rootDir, type, "report", type === "standard" ? "old-list.json" : "list.json"), JSON.stringify(list));
      }
    })
  }

  runStandard() {
    let list = require("../../storage/tempo-storm/standard/report/old-list");
    let _this = this;
    return co(function* () {
      console.info(`开始获取count`);
      let count = yield _this.getCount("standard");
      console.info(`获取count成功：${count}`);
      console.info(`开始获取pageSlug`);
      let slug = yield _this.getPageSlug(count, "standard");
      console.info(`获取pageSlug成功：${slug}`);
      const reportName = `tempo-storm-${slug.replace("meta-snapshot/standard/","")}`;
      console.info(`开始获取deckSlugList`);
      let {deckSlugList, time} = yield _this.getDeckSlugList(slug, "standard");
      console.info(`获取deckSlugList成功：${deckSlugList}`);
      let findReport = list.find(item => item.name === reportName);
      let reportContent;
      if (findReport) {
        reportContent = require(`../../storage/tempo-storm/standard/deck/${reportName}.json`);
        let count = 0;
        Object.keys(reportContent).forEach(key => {
          let occupationItem = reportContent[key];
          count += occupationItem.length;
        });
        yield _this.build(count, deckSlugList, reportContent, list, reportName, "standard");
      } else {
        reportContent = {};
        list.unshift({
          "name": reportName,
          "time": time,
          "fromUrl": `https://tempostorm.com/hearthstone/meta-snapshot/standard/${slug}`
        });
        yield _this.build(0, deckSlugList, reportContent, list, reportName, "standard");
      }
      console.info(`${reportName} done`);
    });
  }

  runWild() {
    let list = require("../../storage/tempo-storm/wild/report/list");
    let _this = this;
    return co(function* () {
      console.info(`开始获取count`);
      let count = yield _this.getCount("wild");
      console.info(`获取count成功：${count}`);
      console.info(`开始获取pageSlug`);
      let slug = yield _this.getPageSlug(count, "wild");
      console.info(`获取pageSlug成功：${slug}`);
      const reportName = `tempo-storm-${slug}`;
      console.info(`开始获取deckSlugList`);
      let {deckSlugList, time} = yield _this.getDeckSlugList(slug, "wild");
      console.info(`获取deckSlugList成功：${deckSlugList.length}`);
      let findReport = list.find(item => item.name === reportName);
      let reportContent;
      if (findReport) {
        reportContent = require(`../../storage/tempo-storm/wild/deck/${reportName}.json`);
        let count = 0;
        Object.keys(reportContent).forEach(key => {
          let occupationItem = reportContent[key];
          count += occupationItem.length;
        });
        yield _this.build(count, deckSlugList, reportContent, list, reportName, "wild");
      } else {
        reportContent = {};
        list.unshift({
          "name": reportName,
          "time": time,
          "fromUrl": `https://tempostorm.com/hearthstone/meta-snapshot/wild/${slug}`
        });
        yield _this.build(0, deckSlugList, reportContent, list, reportName, "wild");
      }
      console.info(`${reportName} done`);
    });
  }
}


module.exports = TempoStormSpider;
