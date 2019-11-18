const utils = require("../../../utils/utils");
const path = require("path");
const storagePath = path.resolve(__dirname, '../../../../storage');
const codeList = require("./codeList");
const co = require('co');


class CodeReader {
  run(type, keyWork, codeList) {
    let _this = this;
    let rootDir = path.join(storagePath, keyWork);
    let list = require(`../../../../storage/${keyWork}/${type}/report/list`);
    return co(function* () {
      for (let i = 0; i < codeList.length; i++) {
        let reportName = codeList[i].name;
        let time = new Date(codeList[i].time).getTime();
        let deckList = codeList[i].deckList;
        let fromUrl = codeList[i].fromUrl;
        const exist = !!list.find(item => {
          return item.name === reportName;
        });
        if (!exist) {
          let reportContent = {};
          list.unshift({
            "name": reportName,
            "time": time,
            "fromUrl": fromUrl
          });
          for (let j = 0; j < deckList.length; j++) {
            let {cards, occupation} = utils.getCardInfoByCode(deckList[j].code);
            // 构建dir对象
            if (!reportContent[occupation]) {
              reportContent[occupation] = [];
            }
            reportContent[occupation].push({
              name: deckList[j].name,
              cards: cards,
              code: deckList[j].code,
              alreadyFormatName: true
            });
            console.info(`剩余：${deckList.length - j - 1}`);
          }
          yield utils.writeFile(path.join(rootDir, type, "deck", `${reportName}.json`), JSON.stringify(reportContent));
          yield utils.writeFile(path.join(rootDir, type, "report", "list.json"), JSON.stringify(list));
        }
      }
    });
  }
}

let codeReader = new CodeReader();
codeReader.run("wild", "hezonglianheng", codeList);
module.exports = CodeReader;
