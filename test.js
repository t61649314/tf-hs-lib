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
let rootDir = path.join(storagePath, "vicious-syndicate");
let vs = new VS();
return co(function* () {
  for (let i = 0; i < list.length; i++) {
    if (!list[i].jumpUrl) {
      let obj = require(`./storage/vicious-syndicate/standard/deck/${list[i].name}.json`);
      let keys = Object.keys(obj);
      for (let j = 0; j < keys.length; j++) {
        let key = keys[j];
        for (let k = 0; k < obj[key].length; k++) {
          obj[key][k].alreadyFormatName = true;
        }
      }
      yield utils.writeFile(path.join(rootDir, "standard", "deck", `${list[i].name}.json`), JSON.stringify(obj));
    }
  }
});


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
