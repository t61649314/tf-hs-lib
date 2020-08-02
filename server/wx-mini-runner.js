const path = require("path");
const storagePath = path.resolve(__dirname, '../storage');
let rootDir = path.join(storagePath, "wx-mini");
const utils = require("./utils/utils");
const {occupationInfo} = require('../server/spider/const');
const uuid = require('uuid');
const co = require('co');
const preConstructionList = [
  "hearthstone-top-2020-08-02",
  "hearthstone-top-2020-04-07",
  "hearthstone-top-2020-04-04",
  "hearthstone-top-2020-03-31",
  "hearthstone-top-2020-03-28",
  "hearthstone-top-2020-03-29",
  "hearthstone-top-2020-03-30",
  "hearthstone-top-2019-08-03",
  "hearthstone-top-2019-08-05",
  "hearthstone-top-2019-12-07",
  "hearthstone-top-2019-12-08",
  "hearthstone-top-2019-12-09",
  "hearthstone-top-2019-12-10"
];

let listJsonStr = "";
// let deckJsonStr = "";


let occupationList = Object.keys(occupationInfo).map(key => {
  return occupationInfo[key].cnName;
});
co(function* () {
  yield writeWxJson("qianjinsi", "wild", "list");
  yield writeWxJson("shuxing", "wild", "list");
  yield writeWxJson("hezonglianheng", "wild", "list");
  yield writeWxJson("laji", "wild", "list");
  yield writeWxJson("hearthstone-top-decks", "wild", "list");
  yield writeWxJson("team-rankstar", "wild", "list");
  yield writeWxJson("nga-carry", "wild", "list");
  yield writeWxJson("other", "wild", "list");
  yield writeWxJson("vicious-syndicate", "standard", "newest-list");
  yield writeWxJson("vicious-syndicate", "standard", "old-list");
  yield writeWxJson("vicious-syndicate", "wild", "list");
  yield writeWxJson("tempo-storm", "standard", "newest-list");
  yield writeWxJson("tempo-storm", "standard", "old-list");
  yield writeWxJson("tempo-storm", "wild", "list");
  yield writeWxJson("shengerkuangye", "wild", "list");
  yield writeWxJson("fengtian", "wild", "list");
  yield writeWxJson("zaowuzhe", "wild", "list");
  yield writeWxJson("suzhijicha", "wild", "list");
  yield writeWxJson("yingdi-daily-wild-report", "wild", "list");
  yield writeWxJson("zuiqianxian-and-wudu", "wild", "list");
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
              deckFormat.time = report.time;
              deckFormat.name = deck.alreadyFormatName ? deck.name : utils.formatDeckName(deck.name, deck.cards, occupation);
              deckFormat.cards = deck.cards.sort((a, b) => {
                return a.cost - b.cost
              });
              deckFormat.code = deck.code;
              if (occupationList.includes(deckFormat.name)) {
                throw new Error(JSON.stringify(deckFormat));
              }
              jsonStr += (JSON.stringify(deckFormat) + "\n");
              // deckJsonStr += (JSON.stringify(deckFormat) + "\n");
            }
          }
          yield utils.makeDirs(dirPath);
          yield utils.writeFile(filePath, jsonStr);
        }
      }

      let listFormat = {};
      if (fileName === "newest-list") {
        listFormat._id = `${from}-${type}-${fileName}`;
      } else {
        listFormat._id = report.name;
      }
      listFormat.preConstruction = preConstructionList.includes(report.name);
      listFormat.name = report.name;
      listFormat.time = report.time;
      listFormat.fromUrl = report.fromUrl;
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
