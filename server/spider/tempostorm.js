const _ = require("lodash");
const utils = require("./utils");
const path = require("path");
const constLib = require("../constLib");
const storagePath = constLib.storagePath;
const getCountUrl = 'https://tempostorm.com/api/snapshots/count?where={"snapshotType":"wild","isActive":true}';
const co = require('co');

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
        "publishDate": {"lte": "2018-10-15T07:07:16.464Z"},
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
        json.cards.forEach(item => {
          arr.push({
            name: item.card.name,
            img: item.card.photoNames.small,
            quantity: item.card.rarity === 'Legendary' ? 0 : item.cardQuantity,
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

  run() {
    let _this = this;
    let dir = {};
    co(function* () {
      let count = yield _this.getCount();
      for (let i = 1; i <= count; i++) {
        let slug = yield _this.getPageSlug(i);
        dir[``] = {};
        let deckSlugList = yield _this.getDeckSlugList(slug);
        for (let j = 0; j < deckSlugList.length; j++) {
          let deck = yield _this.getDeck(deckSlugList[j]);
        }
      }
    });
  }
}

new TempoStormSpider().run();


