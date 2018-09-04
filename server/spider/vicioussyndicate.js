const _ = require("lodash");
const utils = require("./utils");
const path = require("path");
const constLib = require("../constLib");
const storagePath = constLib.storagePath;


let num = 1;
let sun = 0;
run();

function run() {
    console.info(`开始执行${num}`);
    const url = `https://www.vicioussyndicate.com/wild-vs-data-reaper-report-${num}/`;
    const mainDir = path.join(storagePath, "vicioussyndicate", `wild-vs-data-reaper-report-${num}`);
    //请求主页
    utils.startRequest(url).then(($) => {
        const deckHrefList = $('.tag-analysis').children('.entry-content').children('ul').find("a");
        if (deckHrefList.length) {
            deckHrefList.each(function () {
                const href = $(this).attr("href");
                //请求href
                if (href) {
                    sun++;
                    startRequest(href, 3, mainDir);
                }
            });
        } else {
            console.info(`未解析到数据，程序终止`);
            let dirObj = {};
            const rootDir = path.join(storagePath, "vicioussyndicate");
            utils.readDir(rootDir, dirObj);
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

function startRequest(href, tryCount, mainDir) {
    if (tryCount < 0) {
        return false;
    }
    utils.startRequest(href).then(($) => {
        const attachmentMediumDom = $('.attachment-medium');
        if (attachmentMediumDom.length) {
            const name = attachmentMediumDom.attr("alt");
            const imgUrl = attachmentMediumDom.attr("data-cfsrc");
            const code = attachmentMediumDom.parent().parent().next().attr("data-clipboard-text");
            const nameSplitArr = name.split(" ");
            const occupation = nameSplitArr[nameSplitArr.length - 1];
            const fileDir = path.join(mainDir, occupation);
            const jsonObj = {
                name: name,
                imgUrl: imgUrl,
                code: code
            };
            utils.makeDirs(fileDir).then(() => {
                utils.writeFile(path.join(fileDir, `${name}.json`), JSON.stringify(jsonObj)).then(() => {
                    sun--;
                    console.info(`${name}写入成功，剩余${sun}`);

                    if (sun === 0) {
                        num++;
                        run()
                    }
                }).catch(err => {
                    console.error(err);
                });
            }).catch(err => {
                console.error(err);
            });
        }
    }).catch(err => {
        if (err === "timeout") {
            tryCount--;
            console.warn(`${href}请求超时，正在重试，剩余重试次数${tryCount}`);
            startRequest(href, tryCount, mainDir);
        }
    });
}