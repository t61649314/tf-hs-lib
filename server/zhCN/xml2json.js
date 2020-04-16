var xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const utils = require("../utils/utils");
const json = require("./2_json_cards_cards_new");
const xmlParser = new xml2js.Parser({
  explicitArray: false
}); // xml -> json
let jsonFormat = {};
let keys = Object.keys(json);
keys.forEach(key => {
  let itemObj = json[key];
  let itemObjKeys = Object.keys(itemObj);
  itemObjKeys.forEach(key => {
    jsonFormat[key] = itemObj[key];
  })
});
const occupationMap = {
  "HERO_01": "Warrior",
  "HERO_02": "Shaman",
  "HERO_03": "Rogue",
  "HERO_04": "Paladin",
  "HERO_05": "Hunter",
  "HERO_06": "Druid",
  "HERO_07": "Warlock",
  "HERO_08": "Mage",
  "HERO_09": "Priest",
  "HERO_10": "Demon Hunter"
};
const rarityMap = {
  "0": "Null",
  "1": "Common",
  "2": "Basic",
  "3": "Rare",
  "4": "Epic",
  "5": "Legendary"
};
fs.readFile(path.resolve(__dirname, './HearthDb.CardDefs.xml'), 'utf-8', function (err, result) {
  xmlParser.parseString(result, function (err, result) {
    const cardZhCNJson = {};
    const occupationIdJson = {};
    result.CardDefs.Entity.forEach(item => {
      if (item.$.CardID.indexOf("HERO_") > -1) {
        Object.keys(occupationMap).forEach(key => {
          if (item.$.CardID.indexOf(key) > -1) {
            if (!occupationIdJson[occupationMap[key]]) {
              occupationIdJson[occupationMap[key]] = [];
            }
            occupationIdJson[occupationMap[key]].push(parseInt(item.$.ID));
          }
        })
      }
      if (item.Tag) {
        let cardSetTag = item.Tag.find(item => {
          return item.$.name === "CARD_SET"
        });
        if (!cardSetTag) {
          cardSetTag = {
            $: {
              value: "4"
            }
          }
        }
        const costTag = item.Tag.find(item => {
          return item.$.name === "COST"
        }) || {$: {value: 0}};
        const rarityTag = item.Tag.find(item => {
          return item.$.name === "RARITY"
        }) || {$: {value: 0}};
        let id = item.$.ID;
        if (id === "57918") {
          id = "1144";
        }
        if (jsonFormat[id]) {
          cardZhCNJson[item.$.ID] = {
            rarity: rarityMap[rarityTag.$.value],
            cost: costTag.$.value,
            cnName: item.Tag[0].zhCN,
            cardSet: cardSetTag.$.value,
            img: (jsonFormat[id] && jsonFormat[id].fullImgUrl) || ""
          };
        } else {
          if (id === "56066") {
            cardZhCNJson[id] = {
              rarity: rarityMap[rarityTag.$.value],
              cost: costTag.$.value,
              cnName: item.Tag[0].zhCN,
              cardSet: cardSetTag.$.value,
              img: (jsonFormat["56067"] && jsonFormat["56067"].fullImgUrl) || ""
            };
          }
        }
      }
    });
    utils.writeFile(path.resolve(__dirname, './occupationIdJson.json'), JSON.stringify(occupationIdJson));
    utils.writeFile(path.resolve(__dirname, './cardZhCNJson.json'), JSON.stringify(cardZhCNJson));
  });
});
