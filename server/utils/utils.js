const https = require('https');
const http = require('http');
const fs = require("fs");
const path = require("path");
const cheerio = require('cheerio');
const request = require('request');
const _ = require("lodash");

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


module.exports = {
  existsFile,
  writeFileFormUrl,
  writeFile,
  startRequest,
  makeDirs
};
