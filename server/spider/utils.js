const https = require('https');
const fs = require("fs");
const path = require("path");
const cheerio = require('cheerio');
const request = require('request');
const _ = require("lodash");

//获取Dir
function readDir(rootPath, obj) {

    const compare = function (string1, string2) {
        if (string1.length < string2.length) {
            return -1;
        } else if (string1.length > string2.length) {
            return 1;
        }
        for (let i = 0; i < string1.length; i++) {
            let val1 = string1[i];
            let val2 = string2[i];
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            }
        }
        return 0;
    };
    const childArr = fs.readdirSync(rootPath).sort(compare);
    childArr.forEach((ele, index) => {
        const childPath = path.join(rootPath, ele);
        const childStat = fs.statSync(childPath);
        if (childStat.isDirectory()) {
            const pChildArr = fs.readdirSync(childPath);
            const pChildStat = fs.statSync(path.join(childPath, pChildArr[0]));
            if (pChildStat.isDirectory()) {
                obj[ele] = {};
                readDir(childPath, obj[ele]);
            } else {
                obj[ele] = pChildArr;
            }
        }
    });
}


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
function startRequest(url) {
    return new Promise(function (resolve, reject) {
        if (_.startsWith(url, "//")) {
            url = "https:" + url;
        }
        https.get(url, (res) => {
            let html = '';
            res.setEncoding('utf-8'); //防止中文乱码
            //监听data事件，每次取一块数据
            res.on('data', function (chunk) {
                html += chunk;
            });
            //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
            res.on('end', () => {
                resolve(cheerio.load(html)); //采用cheerio模块解析html
            });

        }).on('error', (err) => {
            reject(err);
        });
    });
}

//创建目录
function makeDirs(dirpath, mode) {
    return new Promise(function (resolve, reject) {
        try {
            if (!fs.existsSync(dirpath)) {
                let pathTmp;
                dirpath.split(/[/\\]/).forEach(function (dirname) {  //这里指用/ 或\ 都可以分隔目录  如  linux的/usr/local/services   和windows的 d:\temp\aaaa
                    if (pathTmp) {
                        pathTmp = path.join(pathTmp, dirname);
                    } else {
                        pathTmp = dirname;
                    }
                    if (!fs.existsSync(pathTmp)) {
                        fs.mkdirSync(pathTmp, mode);
                    }
                });
                resolve()
            } else {
                resolve()
            }
        } catch (e) {
            reject(e);
        }
    });
}


module.exports = {
    writeFileFormUrl,
    readDir,
    writeFile,
    startRequest,
    makeDirs
};