const fs = require("fs");
fs.readFile('./data/word.txt', 'utf8', function(err, data){
  nodejieba.load({
    userDict: './user.utf8',
  });
  const result = nodejieba.extract(data, 120);
  const tagList = ['原型', '闭包', 'HTTP', 'CORP', 'TCP', 'HTTPS','跨域','XSS','安全','事件循环','VUE','CSS','算法','线程','NODE','','缓存','内存','作用域链','垂直居中','布局','状态码','原型链','ES6','箭头函数',"PROMISE",'垃圾回收','优化'];
  let textNo = JSON.stringify(result.filter(item => tagList.indexOf(item.word.toUpperCase()) >= 0));
  let text = JSON.parse(textNo);
  let temp = "";
  for(let i in text){
    temp += text[i].word + " " + Math.ceil(text[i].weight) + "\n";
  }
  fs.writeFile('./data/'+'wordCloud'+'.txt',temp, 'utf-8', function (err) {
    if (err) {
      console.log(err);
    }
  });
});
