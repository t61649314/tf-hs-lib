import {occupationInfo} from "../../server/spider/const"
import deckZhCNJson from '../../server/zhCN/deckZhCNJson'
import deckKeyCardMapArr from '../../server/zhCN/deckKeyCardMapArr'

const formatDeckName = function (name, decks, occupation) {
  let formatName = "";
  let dbfIds = decks.map(item => {
    return item.dbfId
  });
  let canFormatZh = false;
  name.split(" ").forEach(item => {
    if (deckZhCNJson[item]) {
      formatName += deckZhCNJson[item];
      canFormatZh = true;
    }
  });
  if (!canFormatZh) {
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
  if (formatName) {
    return formatName + occupationInfo[occupation].simpleName;
  } else {
    return occupationInfo[occupation].cnName;
  }
};

export {
  formatDeckName
};
