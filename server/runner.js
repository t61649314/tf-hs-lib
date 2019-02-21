const ViciousSyndicateSpider = require("./spider/ViciousSyndicateSpider");
const TempoStormSpider = require("./spider/TempoStormSpider");
const co = require('co');
co(function* () {
  const vs = new ViciousSyndicateSpider();
  const ts = new TempoStormSpider();
  yield vs.runStandard();
  yield vs.runWild();
  yield ts.runStandard();
  yield ts.runWild();
});

