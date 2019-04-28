const {occupationInfo} = require('../../server/spider/const');
const deckZhCNJson = require('../../server/zhCN/deckZhCNJson');
const deckKeyCardMapArr = require('../../server/zhCN/deckKeyCardMapArr');

const https = require('https');
const http = require('http');
const fs = require("fs");
const path = require("path");
const cheerio = require('cheerio');
const request = require('request');
const _ = require("lodash");

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
  if (formatName) {
    return formatName + occupationInfo[occupation].simpleName;
  } else {
    return occupationInfo[occupation].cnName;
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
    // const opt = {
    //   headers: {
    //     ':authority': 'teamrankstar.com',
    //     ':method': 'GET',
    //     ':path': '/hearthstone-wild-meta-snapshot-late-april-2019/',
    //     ':scheme': 'https',
    //     'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    //     'accept-encoding': 'gzip, deflate, br',
    //     'accept-language': 'zh-CN,zh;q=0.9',
    //     'cache-control': 'max-age=0',
    //     'cookie': '__cfduid=d9d848a033df4338a2a2603c2cdee9fc71556411905; _ga=GA1.2.1649070803.1556411905; _gid=GA1.2.840004415.1556411905; ct_checkjs=404759214; tk_or=%22%22; tk_r3d=%22%22; tk_lr=%22%22; ct_ps_timestamp=1556413121; ct_timezone=8; ct_fkp_timestamp=1556413140; ct_pointer_data=%5B%5B342%2C1386%2C10%5D%2C%5B342%2C1388%2C175%5D%2C%5B379%2C1326%2C308%5D%2C%5B412%2C1342%2C457%5D%2C%5B458%2C1423%2C731%5D%2C%5B458%2C1424%2C758%5D%2C%5B465%2C1419%2C908%5D%2C%5B503%2C1414%2C1082%5D%2C%5B504%2C1398%2C1208%5D%2C%5B514%2C1353%2C1698%5D%2C%5B555%2C710%2C1809%5D%2C%5B535%2C297%2C1958%5D%2C%5B492%2C490%2C2108%5D%2C%5B480%2C606%2C2258%5D%2C%5B478%2C651%2C2408%5D%2C%5B478%2C655%2C2698%5D%2C%5B478%2C656%2C2714%5D%2C%5B477%2C658%2C2947%5D%2C%5B493%2C676%2C3008%5D%2C%5B495%2C687%2C3308%5D%2C%5B529%2C712%2C3458%5D%2C%5B540%2C714%2C3608%5D%2C%5B656%2C661%2C3759%5D%2C%5B740%2C678%2C4003%5D%2C%5B730%2C685%2C4058%5D%2C%5B723%2C690%2C4346%5D%2C%5B721%2C691%2C4358%5D%2C%5B712%2C707%2C4513%5D%2C%5B709%2C707%2C4890%5D%2C%5B613%2C685%2C4959%5D%2C%5B13%2C450%2C237950%5D%2C%5B12%2C450%2C238091%5D%2C%5B1%2C654%2C1020972%5D%2C%5B155%2C769%2C1021059%5D%2C%5B229%2C951%2C1021209%5D%2C%5B256%2C974%2C1021361%5D%2C%5B255%2C961%2C1021593%5D%2C%5B176%2C744%2C1021659%5D%2C%5B7%2C421%2C1021809%5D%2C%5B4%2C499%2C1084963%5D%2C%5B31%2C532%2C1087077%5D%2C%5B188%2C685%2C1087208%5D%2C%5B201%2C770%2C1087398%5D%2C%5B134%2C738%2C1087508%5D%2C%5B129%2C743%2C1087657%5D%2C%5B210%2C768%2C1087807%5D%2C%5B264%2C837%2C1088037%5D%2C%5B260%2C869%2C1088106%5D%2C%5B297%2C977%2C1088257%5D%5D\n',
    //     'if-modified-since': 'Sat, 27 Apr 2019 18:40:04 GMT',
    //     'upgrade-insecure-requests': '1',
    //     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36',
    //   }
    // };
    //

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


module.exports = {
  formatDeckName,
  existsFile,
  writeFileFormUrl,
  writeFile,
  startRequest,
  makeDirs
};
