var xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const utils = require("../utils/utils");
const xmlParser = new xml2js.Parser({
  explicitArray: false
}); // xml -> json
const occupationMap = {
  "HERO_01": "Warrior",
  "HERO_02": "Shaman",
  "HERO_03": "Rogue",
  "HERO_04": "Paladin",
  "HERO_05": "Hunter",
  "HERO_06": "Druid",
  "HERO_07": "Warlock",
  "HERO_08": "Mage",
  "HERO_09": "Priest"
};
fs.readFile(path.resolve(__dirname, './HearthDb.CardDefs.xml'), 'utf-8', function (err, result) {
  xmlParser.parseString(result, function (err, result) {
    const cardZhCNJson = {};
    const occupationIdJson = {};
    result.CardDefs.Entity.forEach(item => {
      if (item.$.CardID.indexOf("HERO_0") > -1) {
        Object.keys(occupationMap).forEach(key=>{
          if (item.$.CardID.indexOf(key) > -1) {
            if(!occupationIdJson[occupationMap[key]]){
              occupationIdJson[occupationMap[key]]=[];
            }
            occupationIdJson[occupationMap[key]].push(parseInt(item.$.ID));
          }
        })
      }
      if (item.Tag) {
        const cardSetTag = item.Tag.find(item => {
          return item.$.name === "CARD_SET"
        });
        cardZhCNJson[item.$.ID] = {
          cnName: item.Tag[0].zhCN,
          cardSet: cardSetTag.$.value
        }
      }
    });
    utils.writeFile(path.resolve(__dirname, './occupationIdJson.json'), JSON.stringify(occupationIdJson));
    utils.writeFile(path.resolve(__dirname, './cardZhCNJson.json'), JSON.stringify(cardZhCNJson));
  });
});
