const VarInt = require("./VarInt");
const Deck = require("./Deck");
const Hero = require("./Hero");
const Card = require("./Card");
module.exports = class Deckcode {

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

    Object.keys($cards).forEach(key => {
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

  getDeckFromCode($code) {

    if (!$code) {
      throw new Error("code is empty");
    }

    let $varint = new VarInt();
    let $data = $varint.decode($code);

    if ($data[0] !== 0) {
      throw new Error("code is error");
    }

    let $version = $data[1];
    if ($version !== this.DECKCODE_VERSION) {
      throw new Error("Unsupported version: {$version}");
    }

    let $format = $data[2];
    let $deck = new Deck($format);

    let $num_heroes = $data[3];

    let $offset = 4;
    for (let $i = 0; $i < $num_heroes; $i++) {
      let $hero_id = $data[$offset];
      $deck.addHero(new Hero($hero_id));
      $offset++;
    }

    let $num_cards_x1 = $data[$offset];
    $offset++;

    for (let $i = 0; $i < $num_cards_x1; $i++) {
      let $card_id = $data[$offset];
      $deck.addCard(new Card($card_id, 1));
      $offset++;
    }

    let $num_cards_x2 = $data[$offset];
    $offset++;

    for (let $i = 0; $i < $num_cards_x2; $i++) {
      let $card_id = $data[$offset];
      $deck.addCard(new Card($card_id, 2));
      $offset++;
    }

    let $num_cards_xn = $data[$offset];
    $offset++;

    for (let $i = 0; $i < $num_cards_xn; $i++) {
      let $card_id = $data[$offset];
      let $count = $data[$offset + 1];
      $deck.addCard(new Card($card_id, $count));
      $offset += 2;
    }
    return $deck;
  }

  sortCards($cards) {
    let $by_count = {"1": [], "2": [], 'n': []};
    $cards.forEach($card => {
      let $bucket = $card.count > 2 ? 'n' : $card.count;
      $by_count[$bucket].push($card);
    });
    return $by_count;
  }
};
