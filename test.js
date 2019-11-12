const {occupationInfo} = require("./server/spider/const")
const deckZhCNJson = require('./server/zhCN/deckZhCNJson')
const cardZhCNJson = require('./server/zhCN/cardZhCNJson.json')
const co = require("co");
const fs = require("fs");
const path = require("path");
const storagePath = path.resolve(__dirname, './storage');
const utils = require("./server/utils/utils");
const list = require("./storage/hearthstone-top-decks/wild/report/list");
let rootDir = path.join(storagePath, "hearthstone-top-decks");
const Deckcode = require("./server/utils/deckcode/Deckcode");
const Const = require("./server/spider/const");
// fs.readFile('./20191112.json', 'utf8', function (err, data) {
//   let dataArr = data.split("\n");
//   dataArr = dataArr.slice(0, dataArr.length - 1);
//   let arr = [];
//   dataArr.forEach(item => {
//     let deck = JSON.parse(item);
//     let count = 0;
//     if (!deck.cards) {
//       console.log(item);
//     } else {
//       deck.cards.forEach(item => {
//         count += item.quantity
//       });
//       if (count < 30) {
//         console.log(item);
//       }
//     }
//   })
// });

function getCardInfoByCode(code) {
  let deckFromCode = new Deckcode().getDeckFromCode(code);
  let occupationInfo = Const.occupationInfo;
  let occupationId = deckFromCode.heroes[0].id;
  let occupation = Object.keys(occupationInfo).find(item => {
    return occupationInfo[item].dbfId.includes(occupationId);
  });
  if (!occupation) {
    console.warn(`not find this occupation : ${occupationId}`)
  }
  let arr = deckFromCode.cards.map(item => {
    return {
      dbfId: item.id,
      cnName: cardZhCNJson[item.id].cnName,
      cardSet: cardZhCNJson[item.id].cardSet,
      img2: cardZhCNJson[item.id].img,
      quantity: item.count,
      rarity: cardZhCNJson[item.id].rarity,
      cost: cardZhCNJson[item.id].cost
    }
  });
  return {
    cards: arr,
    occupation: occupation
  };
}

//
// fs.readFile('./error.json', 'utf8', function (err, data) {
//   co(function* () {
//     let dataArr = data.split("\n");
//     dataArr = dataArr.slice(0, dataArr.length - 1);
//     let arr = [];
//     for (let i = 0; i < dataArr.length; i++) {
//       let item = dataArr[i];
//       let deck = JSON.parse(item);
//       let {cards} = yield getCardInfoByCode(deck.code);
//       deck.cards = cards;
//       arr.push(deck);
//     }
//     yield utils.writeFile(path.resolve(__dirname, './format.json'), arr.map(item => JSON.stringify(item)).join("\n") + "\n");
//   });
// });


// let deckJsonStr = "";


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
