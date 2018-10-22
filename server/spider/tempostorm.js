const _ = require("lodash");
const utils = require("./utils");
const path = require("path");
const Const = require("./const.js");
const storagePath = path.resolve(__dirname, '../../storage');
const getCountUrl = 'https://tempostorm.com/api/snapshots/count?where={"snapshotType":"wild","isActive":true}';
const co = require('co');
const Deckcode = require("../utils/deckcode/Deckcode");
const Deck = require("../utils/deckcode/Deck");
const Card = require("../utils/deckcode/Card");
const Hero = require("../utils/deckcode/Hero");
let dir = require("../../storage/tempo-storm/dir.json") || {};
const FORMAT_WILD = 1;
const FORMAT_STANDARD = 2;

class TempoStormSpider {
  getCount() {
    return new Promise((resolve, reject) => {
      utils.startRequest(encodeURI(getCountUrl), false, true).then((json) => {
        resolve(json.count);
      }).catch(err => {
        reject(err);
      });
    });
  }

  getPageSlug(page) {
    const params = {
      "order": "createdDate+DESC",
      "fields": ["id", "snapshotType", "isActive", "publishDate"],
      "where": {
        "isActive": true,
        "publishDate": {"lte": new Date().toJSON()},
        "snapNum": page,
        "snapshotType": "wild"
      },
      "include": [{"relation": "slugs"}]
    };
    const getPageDateUrl = `https://tempostorm.com/api/snapshots/findOne?filter=${JSON.stringify(params)}`;
    return new Promise((resolve, reject) => {
      utils.startRequest(encodeURI(getPageDateUrl), false, true).then((json) => {
        resolve(json.slugs[0].slug);
      }).catch(err => {
        reject(err);
      });
    });
  }

  getDeckSlugList(slug) {
    const params = {
      "where": {"slug": slug, "snapshotType": "wild"},
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
    return new Promise((resolve, reject) => {
      utils.startRequest(encodeURI(getPageDateUrl), false, true).then(json => {
        json.deckTiers.forEach(item => {
          arr.push(item.deck.slugs[0].slug);
        });
        resolve(arr);
      }).catch(err => {
        reject(err);
      });
    });
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
    return new Promise((resolve, reject) => {
      utils.startRequest(encodeURI(getPageDateUrl), false, true).then(json => {
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
        resolve(deck);
      }).catch(err => {
        reject(err);
      });
    });
  }

  getDeckcode(deck) {
    let $deck = new Deck(FORMAT_WILD);
    $deck.addHero(new Hero(Const.occupationInfo[deck.playerClass].dbfId));
    deck.cards.forEach(item => {
      $deck.addCard(new Card(item.dbfId, item.quantity));
    });
    let $dc = new Deckcode();
    return $dc.getCodeFromDeck($deck);
  }

  run() {
    let _this = this;
    let rootDir = path.join(storagePath, "tempo-storm");
    co(function* () {
      console.info(`开始获取count`);
      let count = yield _this.getCount();
      console.info(`获取count成功：${count}`);

      for (let i = 20; i <= count; i++) {
        console.info(`开始获取pageSlug`);
        let slug = yield _this.getPageSlug(i);
        console.info(`获取pageSlug成功：${slug}`);

        const dirPageName = `tempo-storm-${slug}`;
        dir[dirPageName] = {};

        console.info(`开始获取deckSlugList`);
        let deckSlugList = yield _this.getDeckSlugList(slug);
        console.info(`获取deckSlugList成功：${deckSlugList}`);

        for (let j = 0; j < deckSlugList.length; j++) {
          console.info(`开始获取deck`);
          let deck = yield _this.getDeck(deckSlugList[j]);
          console.info(`获取deck成功：${JSON.stringify(deck)}`);

          //构建dir对象
          if (!dir[dirPageName][deck.playerClass]) {
            dir[dirPageName][deck.playerClass] = [];
          }
          deck.code = _this.getDeckcode(deck);
          dir[dirPageName][deck.playerClass].push(deck);
        }
        yield utils.makeDirs(rootDir);
        yield utils.writeFile(path.join(rootDir, `dir.json`), JSON.stringify(dir));
      }
    });
  }
}

new TempoStormSpider().run();


