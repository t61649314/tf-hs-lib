const ViciousSyndicateSpider = require("./spider/ViciousSyndicateSpider");
const TempoStormSpider = require("./spider/TempoStormSpider");
const TeamRankstarSpider = require("./spider/TeamRankstarSpider");
const HearthstoneTopDecksSpider = require("./spider/HearthstoneTopDecksSpider");
const co = require('co');
co(function* () {
  const vs = new ViciousSyndicateSpider();
  const ts = new TempoStormSpider();
  const tr = new TeamRankstarSpider();
  const htd = new HearthstoneTopDecksSpider();
  // yield vs.runStandard();
  // yield vs.runWild();
  yield ts.runStandard();
  yield ts.runWild();
  yield tr.run();
  yield htd.run();
});

