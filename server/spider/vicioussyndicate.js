const _ = require("lodash");
const utils = require("./utils");
const path = require("path");
const constLib = require("../constLib");
const storagePath = constLib.storagePath;
let dir = require("../../static/storage/vicioussyndicate/dir.json");

let mainIndex = 1;
let hrefList = [];
let rootName = "";
let url = "";
let mainDir = "";
run();

function run() {
    console.info(`开始执行${mainIndex}`);
    rootName = `wild-vs-data-reaper-report-${mainIndex}`;
    dir[rootName] = {};
    url = `https://www.vicioussyndicate.com/${rootName}/`;
    mainDir = path.join(storagePath, "vicioussyndicate", rootName);
    //请求主页
    utils.startRequest(url).then(($) => {
        const deckHrefList = $('.tag-analysis').children('.entry-content').children('ul').find("a");
        if (deckHrefList.length) {
            deckHrefList.each(function () {
                const href = $(this).attr("href");
                //请求href
                if (href) {
                    hrefList.push(href);
                }
            });
            readChildPage();
        } else {
            //请求到的页面没有我们想要的东西，默认视为404了，开始解析目录
            console.info(`未解析到数据，程序终止`);
            const rootDir = path.join(storagePath, "vicioussyndicate");
            utils.writeFile(path.join(rootDir, `dir.json`), JSON.stringify(dir)).then(() => {
                console.info(`dir写入成功`);
            }).catch(err => {
                console.error(err);
            });
        }
    }).catch(err => {
        console.error(err);
    });
}

function writeImg(imgUrl, filePath, name, occupation, code) {
    utils.writeFileFormUrl(imgUrl, filePath).then(() => {
        if (!dir[rootName][occupation]) {
            dir[rootName][occupation] = [];
        }
        dir[rootName][occupation].push({name: name, code: code});
        console.info(`${imgUrl}写入成功，剩余${hrefList.length}`);
        if (hrefList.length) {
            readChildPage()
        } else {
            mainIndex++;
            run()
        }
    }).catch(err => {
        console.error(err);
    });
}

function readChildPage() {
    const href = hrefList.shift();
    utils.startRequest(href).then(($) => {
        console.info(`${href}读取成功`);
        const attachmentMediumDom = $('.attachment-medium');
        if (attachmentMediumDom.length) {
            const name = attachmentMediumDom.attr("alt");
            const imgUrl = attachmentMediumDom.attr("data-cfsrc");
            const code = attachmentMediumDom.parent().parent().next().attr("data-clipboard-text");
            const nameSplitArr = name.split(" ");
            const occupation = nameSplitArr[nameSplitArr.length - 1];
            const fileDir = path.join(mainDir, occupation);
            utils.makeDirs(fileDir).then(() => {
                writeImg(imgUrl, path.join(fileDir, `${name}.png`), name, occupation, code);
            }).catch(err => {
                console.error(err);
            });
        }
    }).catch(err => {
        console.error(err);
    });
}