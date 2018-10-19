module.exports = class Deck {
  constructor(format) {
    this.heroes = [];
    this.cards = [];
    this.format = format;
  }

  addHero(hero) {
    this.heroes.push(hero);
  }

  addCard(card) {
    this.cards.push(card);
  }
};
