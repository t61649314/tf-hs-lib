const VarInt = require("./VarInt");
module.exports =class Deckcode {

  constructor() {
    this.DECKCODE_VERSION = 1
  }

  getCodeFromDeck(deck) {
    let $ints = [0, this.DECKCODE_VERSION, deck.format];

    $ints.push(deck.heroes.length);


    deck.heroes.forEach(item => {
      $ints.push(item.id);
    });

    let $cards = this.sortCards(deck.cards);

    Object.keys($cards).forEach(key=>{
      $ints.push($cards[key].length);
      $cards[key].forEach($card => {
        $ints.push($card.id);
        if (key === 'n') {
          $ints.push($card.count);
        }
      });
    });


    let $varint = new VarInt();

    let $raw = $varint.encode($ints);

    return new Buffer($raw).toString('base64');
  }

  sortCards($cards) {
    let $by_count = {"1": [], "2": [], 'n': []};
    $cards.forEach($card => {
      let $bucket = $card.count > 2 ? 'n' : $card.count;
      $by_count[$bucket].push($card);
    });
    return $by_count;
  }
}
