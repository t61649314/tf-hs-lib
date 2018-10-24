var xml2js = require('xml2js');
const fs = require('fs');
const utils = require("../utils/utils");
const xmlParser = new xml2js.Parser({
  explicitArray: false
}); // xml -> json
fs.readFile('./HearthDb.CardDefs.xml', 'utf-8', function (err, result) {
  xmlParser.parseString(result, function (err, result) {
    const cardZhCNJson={};
    result.CardDefs.Entity.forEach(item => {
      cardZhCNJson[item.$.ID] = item.Tag && item.Tag[0].zhCN;
    });
    utils.writeFile('./cardZhCNJson.json', JSON.stringify(cardZhCNJson));
  });
});
