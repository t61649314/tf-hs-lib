import {occupationInfo} from "../../server/spider/const"
import deckZhCNJson from '../../server/zhCN/deckZhCNJson'
import deckKeyCardMapArr from '../../server/zhCN/deckKeyCardMapArr'
import deckZhCNWordGroupJson from '../../server/zhCN/deckZhCNWordGroupJson'

const formatDeckName = function (name, decks, occupation) {
  let deckZhCNWordGroupKeyList = Object.keys(deckZhCNWordGroupJson);
  let deckZhCNWordGroupValueList = Object.values(deckZhCNWordGroupJson);
  if(name.indexOf(occupation)>-1){
    name = name.split(occupation)[0];
  }
  deckZhCNWordGroupKeyList.forEach(item => {
    if (name.indexOf(item) > -1) {
      name = name.replace(item, deckZhCNWordGroupJson[item]);
    }
  });
  let formatName = "";
  name.split(" ").forEach(item => {
    if (deckZhCNJson[item]) {
      let name = deckZhCNJson[item];
      if (name === "OTK") {
        if (occupation === "Paladin") {
          let find435 = decks.find(item => {
            return item.dbfId === 435
          });
          if(find435){
            name = "元气";
          }else{
            name = "天启";
          }
        }
        if (occupation === "Mage") {
          let find58770 = decks.find(item => {
            return item.dbfId === 58770
          });
          if(find58770){
            name = "冰";
          }else{
            name = "无限火球";
          }
        }
      }
      if (item === "Hand") {
        if (occupation === "Warrior") {
          name = "无限";
        } else {
          name = "手牌";
        }
      }
      formatName += name;
    } else if (deckZhCNWordGroupValueList.includes(item)) {
      formatName += item;
    }
  });
  if (!formatName) {
    let dbfIds = decks.map(item => {
      return item.dbfId
    });
    for (let i = 0; i < deckKeyCardMapArr.length; i++) {
      if (deckKeyCardMapArr[i].occupation && deckKeyCardMapArr[i].occupation.length && !deckKeyCardMapArr[i].occupation.includes(occupation)) {
        continue;
      }
      let matching;
      if (deckKeyCardMapArr[i].anyOneId) {
        matching = false;
        deckKeyCardMapArr[i].ids.forEach(dbfId => {
          matching = matching || dbfIds.includes(dbfId);
        });
      } else {
        matching = true;
        deckKeyCardMapArr[i].ids.forEach(dbfId => {
          matching = matching && dbfIds.includes(dbfId);
        });
      }
      if (matching) {
        formatName = deckKeyCardMapArr[i].name;
        break;
      }
    }
  }
  try {
    if (formatName) {
      return formatName + occupationInfo[occupation].simpleName;
    } else {
      return occupationInfo[occupation].cnName;
    }
  } catch (e) {
    console.log(e)
  }
};

export {
  formatDeckName
};
