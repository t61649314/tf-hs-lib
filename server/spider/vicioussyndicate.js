const _ = require("lodash");
const utils = require("./utils");
const path = require("path");
const constLib = require("../constLib");
const storagePath = constLib.storagePath;

let mainIndex = 1;
let hrefList = [];
let url = "";
let mainDir = "";
run();

function run() {
    console.info(`开始执行${mainIndex}`);
    url = `https://www.vicioussyndicate.com/wild-vs-data-reaper-report-${mainIndex}/`;
    mainDir = path.join(storagePath, "vicioussyndicate", `wild-vs-data-reaper-report-${mainIndex}`);
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
            let dirObj = {};
            const rootDir = path.join(storagePath, "vicioussyndicate");
            //读取目录结构
            utils.readDir(rootDir, dirObj);
            //把目录结构写入json
            utils.writeFile(path.join(rootDir, `dir.json`), JSON.stringify(dirObj)).then(() => {
                console.info(`dir写入成功`);
            }).catch(err => {
                console.error(err);
            });
        }
    }).catch(err => {
        console.error(err);
    });
}

function writeImg(imgUrl, filePath) {
    utils.writeFileFormUrl(imgUrl, filePath).then(() => {
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
                writeImg(imgUrl, path.join(fileDir, `${name}.png`));
            }).catch(err => {
                console.error(err);
            });
        }
    }).catch(err => {
        console.error(err);
    });
}