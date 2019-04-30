const ViciousSyndicateSpider = require("./spider/ViciousSyndicateSpider");
const TempoStormSpider = require("./spider/TempoStormSpider");
const TeamRankstarSpider = require("./spider/TeamRankstarSpider");
const co = require('co');
co(function* () {
  const vs = new ViciousSyndicateSpider();
  const ts = new TempoStormSpider();
  const tr = new TeamRankstarSpider();
  yield vs.runStandard();
  yield vs.runWild();
  yield ts.runStandard();
  yield ts.runWild();
  yield tr.run();
});

