const path = require("path");
const storagePath = path.resolve(__dirname, '../storage');
let rootDir = path.join(storagePath, "wx-mini");
const utils = require("./utils/utils");
const {occupationInfo} = require('../server/spider/const');
const uuid = require('uuid');
const co = require('co');



let occupationList = Object.keys(occupationInfo).map(key => {
  return occupationInfo[key].cnName;
});
co(function* () {
  yield writeWxJson("yuebang", "wild", "list");
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
      let preConstruction = false;
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
              deckFormat.from = from;
              deckFormat.type = type;
              deckFormat.page = report.name;
              deckFormat.occupation = occupation;
              deckFormat.name = deck.alreadyFormatName ? deck.name : utils.formatDeckName(deck.name, deck.cards, occupation);
              if (occupationList.includes(deckFormat.name)) {
                console.log(deckFormat)
              }
            }
          }
        }
        if(occupations[0]){
          preConstruction = !!decks[occupations[0]].find(item=>item.name.indexOf("[Theorycraft]") > -1);
        }
      }
    }
  });
}
