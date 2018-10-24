const ts = require("./storage/tempo-storm/dir");
const vs = require("./storage/vicious-syndicate/dir");


let nameMap = {};
let nameArr = [];
Object.keys(ts).forEach(pageName => {
  Object.keys(ts[pageName]).forEach(occupationName => {
    ts[pageName][occupationName].forEach(item => {
      item.name.split(" ").forEach(nameSp => {
        if (nameMap[nameSp]) {
          nameMap[nameSp]++;
        } else {
          nameMap[nameSp] = 1;
          nameArr.push(nameSp);
        }
      })
    })
  })
});
Object.keys(vs).forEach(pageName => {
  Object.keys(vs[pageName]).forEach(occupationName => {
    vs[pageName][occupationName].forEach(item => {
      item.name.split(" ").forEach(nameSp => {
        if (nameMap[nameSp]) {
          nameMap[nameSp]++;
        } else {
          nameMap[nameSp] = 1;
          nameArr.push(nameSp);
        }
      })
    })
  })
});

console.log(JSON.stringify(nameArr.sort((a, b) => {
  return nameMap[b] - nameMap[a];
})));
