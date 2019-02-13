var xml2js = require('xml2js');
const fs = require('fs');
const utils = require("../utils/utils");
const xmlParser = new xml2js.Parser({
  explicitArray: false
}); // xml -> json
fs.readFile('./HearthDb.CardDefs.xml', 'utf-8', function (err, result) {
  xmlParser.parseString(result, function (err, result) {
    const cardZhCNJson = {};
    result.CardDefs.Entity.forEach(item => {
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
    utils.writeFile('./cardZhCNJson.json', JSON.stringify(cardZhCNJson));
  });
});
