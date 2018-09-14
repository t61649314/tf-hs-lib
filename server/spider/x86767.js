const _ = require("lodash");
const utils = require("./utils");
const path = require("path");
const constLib = require("../constLib");
const storagePath = constLib.storagePath;
const request = require('request');
let bookId = 149;
let chapterIndex = 7001;
let time = 1535254989;
let index = 1;
let lastSaveTime;
let mainDir = path.join(storagePath, "x86767");
run();


function run() {
    console.log("time:" + time + "chapterIndex：" + chapterIndex + "index：" + index);
    const imgUrl = `http://img.fox800.xyz/images/${bookId}/${time}_book_${bookId}_chapter_${chapterIndex}_${index}.jpg?x-oss-process=image/resize,m_lfit,w_640,limit_0/auto-orient,1/quality,Q_90`;
    const fileDir = path.join(mainDir, chapterIndex.toString());
    utils.makeDirs(fileDir).then(() => {
        request.head(imgUrl, function (err, res, body) {
            if (res.statusCode === 200) {
                utils.writeFileFormUrl(imgUrl, path.join(fileDir, index.toString() + ".png")).then(() => {
                    console.info("success");
                    end(true);
                }).catch(err => {
                    console.error(err);
                });
            } else {
                end(false);
            }
        });
    }).catch(err => {
        console.error(err);
    });
}

function end(success) {
    if (success) {
        index++;
        lastSaveTime = time;
    } else {
        if (lastSaveTime && time - lastSaveTime > 5) {
            lastSaveTime = null;
            chapterIndex++;
            index = 1;
        } else {
            time++;
        }
    }
    run();
}
