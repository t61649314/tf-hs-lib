const utils = require("./server/spider/utils");
const path = require("path");
let a={}
utils.readDir(path.join(__dirname,"static","storage","vicioussyndicate"),a);

// const compare = function (string1, string2) {
//     if (string1.length < string2.length) {
//         return false;
//     } else if (string1.length > string2.length) {
//         return true;
//     }
//     for (let i = 0; i < string1.length; i++) {
//         let val1 = string1[i];
//         let val2 = string2[i];
//         if (val1 < val2) {
//             return false;
//         } else if (val1 > val2) {
//             return true;
//         }
//     }
//     return false;
// };
//
// compare("wild-vs-data-reaper-report-4", "wild-vs-data-reaper-report-10");