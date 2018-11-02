const ViciousSyndicateSpider = require("./spider/vicioussyndicate");
const TempoStormSpider = require("./spider/tempostorm");
const co = require('co');
co(function* () {
  const vs = new ViciousSyndicateSpider();
  const ts = new TempoStormSpider();
  yield vs.runStandard();
  yield vs.runWild();
  yield ts.runStandard();
  yield ts.runWild();
});

