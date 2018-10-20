const utils = require("./utils");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../storage');
const co = require('co');
const tinify = require("tinify");
tinify.key = "f348cyVw8EYflrQ0esvr3IZ0xQwdsRBr";

const occupationArr = ["Druid", "Hunter", "Mage", "Paladin", "Priest", "Rogue", "Shaman", "Warlock", "Warrior"];

class ViciousSyndicateSpider {
  readChildPage(url) {
    return new Promise((resolve, reject) => {
      utils.startRequest(url).then(($) => {
        console.info(`${url}读取成功`);
        const attachmentMediumDom = $('.attachment-medium');
        if (attachmentMediumDom.length) {
          const name = attachmentMediumDom.attr("alt");
          const imgUrl = attachmentMediumDom.attr("data-cfsrc");
          const code = attachmentMediumDom.parent().parent().next().attr("data-clipboard-text");
          let occupation = "Other";
          occupationArr.forEach(item => {
            if (name.indexOf(item) > -1) {
              occupation = item;
              return false;
            }
          });
          resolve({
            name: name,
            imgUrl: imgUrl,
            code: code,
            occupation: occupation,
          })
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  readHomePage(url) {
    return new Promise((resolve, reject) => {
      utils.startRequest(url).then(($) => {
        console.info(`${url}读取成功`);
        const deckHrefList = $('.tag-analysis').children('.entry-content').children('ul').find("a");
        if (deckHrefList.length) {
          let hrefList = [];
          deckHrefList.each(function () {
            const href = $(this).attr("href");
            if (href) {
              hrefList.push(href);
            }
          });
          resolve(hrefList);
        } else {
          //请求到的页面没有我们想要的东西，默认视为404了，开始解析目录
          console.info(`未解析到数据，程序终止`);
          reject({notFind: true});
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  run() {
    let _this = this;
    let dir = {};
    let errorUrlArr = [];
    co(function* () {
      for (let i = 1; ; i++) {
        let itemName = `wild-vs-data-reaper-report-${i}`;
        dir[itemName] = {};
        let rootDir = path.join(storagePath, "vicious-syndicate");
        let itemDir = path.join(rootDir, itemName);
        let url = `https://www.vicioussyndicate.com/${itemName}/`;
        try {
          console.info(`${url}开始读取`);
          let hrefList = yield _this.readHomePage(url);
          for (let j = 0; j < hrefList.length; j++) {
            console.info(`${hrefList[j]}开始读取`);
            let deckInfo = yield _this.readChildPage(hrefList[j]);

            //构建dir对象
            if (!dir[itemName][deckInfo.occupation]) {
              dir[itemName][deckInfo.occupation] = [];
            }
            dir[itemName][deckInfo.occupation].push({name: deckInfo.name, code: deckInfo.code});

            //定义文件夹路径和文件路径
            const fileDir = path.join(itemDir, deckInfo.occupation);
            const filePath = path.join(fileDir, `${deckInfo.name}.png`);
            //创建文件夹
            yield utils.makeDirs(fileDir);

            //判断文件是否存在
            const isExists = yield utils.existsFile(filePath);
            if (isExists) {
              console.info(`${deckInfo.name}.png已经存在，跳过下载`);
            } else {
              //tinify读取图片
              try {
                console.info(`${deckInfo.name}.png开始写入`);
                const source = tinify.fromUrl(encodeURI(deckInfo.imgUrl));
                yield source.toFile(filePath);
                console.info(`${deckInfo.name}.png写入成功`);
              } catch (e) {
                console.error(e);
                console.error(`${deckInfo.name}.png写入失败`);
                console.error(`imgUrl：${deckInfo.imgUrl}`);
                errorUrlArr.push({imgUrl: deckInfo.imgUrl, filePath: filePath});
              }
            }
            console.info(`该篇周报剩余：${hrefList.length - j - 1}`);
          }
        } catch (e) {
          console.error(e);
          if (e.notFind) {
            yield utils.writeFile(path.join(rootDir, `dir.json`), JSON.stringify(dir));
            console.info(`dir写入成功`);
            console.info(`写入失败：${errorUrlArr}`);
            console.info(`完成`);
            break;
          }
        }
      }
    });
  }
}

new ViciousSyndicateSpider().run();
