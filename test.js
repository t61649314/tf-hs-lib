const {occupationInfo} = require("./server/spider/const")
const deckZhCNJson = require('./server/zhCN/deckZhCNJson')
const deckKeyCardMapArr = require('./server/zhCN/deckKeyCardMapArr')
const co = require("co");
const cheerio = require("cheerio");
const path = require("path");
const superagent = require("superagent-charset");
const storagePath = path.resolve(__dirname, './storage');
const utils = require("./server/utils/utils");
const list = require("./storage/vicious-syndicate/standard/report/old-list");
const VS = require("./server/spider/vicioussyndicate");
let vs = new VS();

// let deckJsonStr = "";
co(function* () {
  yield addFrom("vicious-syndicate", "standard", "newest-list");
  yield addFrom("vicious-syndicate", "standard", "old-list");
  yield addFrom("vicious-syndicate", "wild", "list");
  yield addFrom("tempo-storm", "standard", "newest-list");
  yield addFrom("tempo-storm", "standard", "old-list");
  yield addFrom("tempo-storm", "wild", "list");
  yield addFrom("shengerkuangye", "wild", "list");
});
const homePageSearchId = [68573, 60767, 58190, 56065, 52702, 51596, 50430, 49165, 47149, 44758, 43020, 42204];

function addFrom(from, type, fileName) {
  const list = require(`./storage/${from}/${type}/report/${fileName}`);
  return co(function* () {
    for (let i = 0; i < list.length; i++) {
      if (from === "shengerkuangye") {
        list[i].fromUrl = `https://www.iyingdi.com/web/article/search/${homePageSearchId[12 - i - 1]}`;
      }
      if (from === "tempo-storm") {
        if (type === "wild") {
          list[i].fromUrl = `https://tempostorm.com/hearthstone/meta-snapshot/wild/${list[i].name.replace("tempo-storm-", "")}`;
        } else {
          list[i].fromUrl = `https://tempostorm.com/hearthstone/meta-snapshot/standard/${list[i].name.replace("tempo-storm-", "")}`;
        }
      }
      if (from === "vicious-syndicate") {
        list[i].fromUrl = `https://www.vicioussyndicate.com/${list[i].name}/`;
      }
    }
    yield utils.writeFile(path.join(storagePath, from, type, "report", fileName + ".json"), JSON.stringify(list));
  });
}


// return co(function* () {
//   for (let i = 1; i <= 12; i++) {
//       let obj = require(`./storage/shengerkuangye/wild/deck/生而狂野战报第${i}期.json`);
//       let keys = Object.keys(obj);
//       for (let j = 0; j < keys.length; j++) {
//         let key = keys[j];
//         for (let k = 0; k < obj[key].length; k++) {
//           obj[key][k].alreadyFormatName = true;
//         }
//       }
//       yield utils.writeFile(path.join(rootDir, "wild", "deck", `生而狂野战报第${i}期.json`), JSON.stringify(obj));
//   }
// });


// co(function* () {
//
//   list.forEach(pitem=>{
//     let obj=require(`./storage/vicious-syndicate/wild/deck/${pitem.name}.json`);
//     Object.keys(obj).forEach(key=>{
//       obj[key].forEach(item=>{
//         if(!formatDeckName(item.name,item.cards,key)){
//           console.log(`${pitem.name}:::::::::::${key}`)
//         }
//       });
//     })
//
//   })
// });
//
//
// function formatDeckName(name, decks, occupation) {
//   let formatName = "";
//   let dbfIds = decks.map(item => {
//     return item.dbfId
//   });
//   let canFormatZh = false;
//   name.split(" ").forEach(item => {
//     if (deckZhCNJson[item]) {
//       formatName += deckZhCNJson[item];
//       canFormatZh = true;
//     }
//   });
//   if (!canFormatZh) {
//     for (let i = 0; i < deckKeyCardMapArr.length; i++) {
//       if (deckKeyCardMapArr[i].occupation && deckKeyCardMapArr[i].occupation.length && !deckKeyCardMapArr[i].occupation.includes(occupation)) {
//         continue;
//       }
//       let matching;
//       if (deckKeyCardMapArr[i].anyOneId) {
//         matching = false;
//         deckKeyCardMapArr[i].ids.forEach(dbfId => {
//           matching = matching || dbfIds.includes(dbfId);
//         });
//       } else {
//         matching = true;
//         deckKeyCardMapArr[i].ids.forEach(dbfId => {
//           matching = matching && dbfIds.includes(dbfId);
//         });
//       }
//       if (matching) {
//         formatName = deckKeyCardMapArr[i].name;
//         break;
//       }
//     }
//   }
//     return !!formatName;
// }
