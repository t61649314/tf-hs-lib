const {occupationInfo} = require('../../server/spider/const');
const deckZhCNJson = require('../../server/zhCN/deckZhCNJson');
const cardZhCNJson = require('../../server/zhCN/cardZhCNJson.json')
const deckKeyCardMapArr = require('../../server/zhCN/deckKeyCardMapArr');
const Deckcode = require("../../server/utils/deckcode/Deckcode");
const https = require('https');
const http = require('http');
const fs = require("fs");
const path = require("path");
const cheerio = require('cheerio');
const request = require('request');
const _ = require("lodash");
const Const = require("../../server/spider/const");

function formatDeckName(name, decks, occupation) {
  let formatName = "";
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
  if (!formatName) {
    name.split(" ").forEach(item => {
      if (deckZhCNJson[item]) {
        formatName += deckZhCNJson[item];
      }
    });
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

//请求url并写到文件
function writeFileFormUrl(reqUrl, fileUrl) {
  const reqUrlSplit = reqUrl.split("/");
  const replaceStr = reqUrlSplit[reqUrlSplit.length - 1];
  reqUrl = reqUrl.replace(replaceStr, encodeURIComponent(replaceStr));
  const readable = request(reqUrl);
  const writable = fs.createWriteStream(fileUrl);
  return new Promise(function (resolve, reject) {
    request.head(reqUrl, function (err, res, body) {
      if (err) {
        reject(err);
      }
    });
    readable.pipe(writable);
    readable.on('end', () => {
      resolve();
    });
  });
}

//写如文本信息到文件
function writeFile(fileUrl, content) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(fileUrl, content, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

//请求url并返回解析对象
function startRequest(url, isHttp, isJSON) {
  return new Promise(function (resolve, reject) {
    if (_.startsWith(url, "//")) {
      url = "https:" + url;
    }

    (isHttp ? http : https).get(url, (res) => {
      let html = '';
      res.setEncoding('utf-8'); //防止中文乱码
      //监听data事件，每次取一块数据
      res.on('data', function (chunk) {
        html += chunk;
      });
      //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
      res.on('end', () => {
        if (isJSON) {
          resolve(JSON.parse(html)); //采用cheerio模块解析html
        } else {
          resolve(cheerio.load(html)); //采用cheerio模块解析html
        }
      });

    }).on('error', (err) => {
      reject(err);
    });
  });
}

//同步创建目录
function makeDirs(dirpath) {
  return new Promise(function (resolve, reject) {
    try {
      if (!fs.existsSync(path.dirname(dirpath))) {
        makeDirs(path.dirname(dirpath));
      }
      if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath);
      }
      resolve()
    } catch (e) {
      reject(e);
    }
  });
}

//判断文件是否存在
function existsFile(filepath) {
  return new Promise(function (resolve, reject) {
    try {
      resolve(fs.existsSync(filepath))
    } catch (e) {
      reject(e);
    }
  });
}

function readFile(filepath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filepath, 'utf-8', (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
}

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
    let card = {
      dbfId: item.id,
      cnName: cardZhCNJson[item.id].cnName,
      cardSet: cardZhCNJson[item.id].cardSet,
      quantity: item.count,
      rarity: cardZhCNJson[item.id].rarity,
      cost: cardZhCNJson[item.id].cost
    };
    if (cardZhCNJson[item.id].img) {
      card.img2 = cardZhCNJson[item.id].img
    } else if (cardZhCNJson[item.id].oldImg) {
      card.img = cardZhCNJson[item.id].oldImg
    }
    return card;
  });
  return {
    cards: arr,
    occupation: occupation
  };
}


module.exports = {
  getCardInfoByCode,
  readFile,
  formatDeckName,
  existsFile,
  writeFileFormUrl,
  writeFile,
  startRequest,
  makeDirs
};
