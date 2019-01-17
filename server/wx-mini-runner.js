const path = require("path");
const storagePath = path.resolve(__dirname, '../storage');
let rootDir = path.join(storagePath, "wx-mini");
const utils = require("./utils/utils");

const uuid = require('uuid');
const co = require('co');
let listJsonStr = "";
// let deckJsonStr = "";
co(function* () {
  yield writeWxJson("vicious-syndicate", "standard", "newest-list");
  yield writeWxJson("vicious-syndicate", "standard", "old-list");
  yield writeWxJson("vicious-syndicate", "wild", "list");
  yield writeWxJson("tempo-storm", "standard", "newest-list");
  yield writeWxJson("tempo-storm", "standard", "old-list");
  yield writeWxJson("tempo-storm", "wild", "list");
});

function writeWxJson(from, type, fileName) {
  const list = require(`../storage/${from}/${type}/report/${fileName}`);
  return co(function* () {
    for (let i = 0; i < list.length; i++) {
      let report = list[i];
      if (!report.jumpUrl) {
        let decks = require(`../storage/${from}/${type}/deck/${report.name}`);
        let occupations = Object.keys(decks);
        let jsonStr = "";
        let dirPath = path.join(rootDir, from, type, "deck");
        let filePath = path.join(dirPath, `${report.name}.json`);
        let existsFile = yield utils.existsFile(filePath);
        if (!existsFile) {
          for (let j = 0; j < occupations.length; j++) {
            let occupation = occupations[j];
            for (let k = 0; k < decks[occupation].length; k++) {
              let deck = decks[occupation][k];
              let deckFormat = {};
              deckFormat._id = uuid.v1();
              deckFormat.from = from;
              deckFormat.type = type;
              deckFormat.page = report.name;
              deckFormat.occupation = occupation;
              deckFormat.name = deck.alreadyFormatName ? deck.name : utils.formatDeckName(deck.name, deck.cards, occupation);
              deckFormat.cards = deck.cards.sort((a, b) => {
                return a.cost - b.cost
              });
              deckFormat.code = deck.code;
              jsonStr += (JSON.stringify(deckFormat) + "\n");
              // deckJsonStr += (JSON.stringify(deckFormat) + "\n");
            }
          }
          yield utils.makeDirs(dirPath);
          yield utils.writeFile(filePath, jsonStr);
        }
      }

      let listFormat = {};
      listFormat._id = report.name;
      listFormat.name = report.name;
      listFormat.time = report.time;
      listFormat.jumpUrl = report.jumpUrl;
      listFormat.type = type;
      listFormat.from = from;
      listFormat.fileName = fileName;
      listJsonStr += (JSON.stringify(listFormat) + "\n")
    }
    yield utils.writeFile(path.join(rootDir, "report.json"), listJsonStr);
    // yield utils.writeFile(path.join(rootDir, "deck.json"), deckJsonStr);
  });
}
