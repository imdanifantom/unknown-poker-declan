"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/pokersolver.js
var require_pokersolver = __commonJS({
  "src/pokersolver.js"(exports2, module2) {
    "use strict";
    var values = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "T",
      "J",
      "Q",
      "K",
      "A"
    ];
    var Card = class {
      constructor(str) {
        this.value = str.substr(0, 1);
        this.suit = str.substr(1, 1).toLowerCase();
        this.rank = values.indexOf(this.value);
        this.wildValue = str.substr(0, 1);
      }
      toString() {
        return this.wildValue.replace("T", "10") + this.suit;
      }
      static sort(a, b) {
        if (a.rank > b.rank) {
          return -1;
        } else if (a.rank < b.rank) {
          return 1;
        } else {
          return 0;
        }
      }
    };
    var Hand2 = class _Hand {
      constructor(cards, name, game, canDisqualify) {
        this.cardPool = [];
        this.cards = [];
        this.suits = {};
        this.values = [];
        this.wilds = [];
        this.name = name;
        this.game = game;
        this.sfLength = 0;
        this.alwaysQualifies = true;
        if (canDisqualify && this.game.lowestQualified) {
          this.alwaysQualifies = false;
        }
        if (game.descr === "standard" && new Set(cards).size !== cards.length) {
          throw new Error("Duplicate cards");
        }
        var handRank = this.game.handValues.length;
        for (var i = 0; i < this.game.handValues.length; i++) {
          if (this.game.handValues[i] === this.constructor) {
            break;
          }
        }
        this.rank = handRank - i;
        this.cardPool = cards.map(function(c) {
          return typeof c === "string" ? new Card(c) : c;
        });
        for (var i = 0; i < this.cardPool.length; i++) {
          card = this.cardPool[i];
          if (card.value === this.game.wildValue) {
            card.rank = -1;
          }
        }
        this.cardPool = this.cardPool.sort(Card.sort);
        var obj, obj1, key, key1, card;
        for (var i = 0; i < this.cardPool.length; i++) {
          card = this.cardPool[i];
          if (card.rank === -1) {
            this.wilds.push(card);
          } else {
            (obj = this.suits)[key = card.suit] || (obj[key] = []);
            (obj1 = this.values)[key1 = card.rank] || (obj1[key1] = []);
            this.suits[card.suit].push(card);
            this.values[card.rank].push(card);
          }
        }
        this.values.reverse();
        this.isPossible = this.solve();
      }
      /**
       * Compare current hand with another to determine which is the winner.
       * @param  {Hand} a Hand to compare to.
       * @return {Number}
       */
      compare(a) {
        if (this.rank < a.rank) {
          return 1;
        } else if (this.rank > a.rank) {
          return -1;
        }
        var result = 0;
        for (var i = 0; i <= 4; i++) {
          if (this.cards[i] && a.cards[i] && this.cards[i].rank < a.cards[i].rank) {
            result = 1;
            break;
          } else if (this.cards[i] && a.cards[i] && this.cards[i].rank > a.cards[i].rank) {
            result = -1;
            break;
          }
        }
        return result;
      }
      /**
       * Determine whether a hand loses to another.
       * @param  {Hand} hand Hand to compare to.
       * @return {Boolean}
       */
      loseTo(hand) {
        return this.compare(hand) > 0;
      }
      /**
       * Determine the number of cards in a hand of a rank.
       * @param  {Number} val Index of this.values.
       * @return {Number} Number of cards having the rank, including wild cards.
       */
      getNumCardsByRank(val) {
        var cards = this.values[val];
        var checkCardsLength = cards ? cards.length : 0;
        for (var i = 0; i < this.wilds.length; i++) {
          if (this.wilds[i].rank > -1) {
            continue;
          } else if (cards) {
            if (this.game.wildStatus === 1 || cards[0].rank === values.length - 1) {
              checkCardsLength += 1;
            }
          } else if (this.game.wildStatus === 1 || val === values.length - 1) {
            checkCardsLength += 1;
          }
        }
        return checkCardsLength;
      }
      /**
       * Determine the cards in a suit for a flush.
       * @param  {String} suit Key for this.suits.
       * @param  {Boolean} setRanks Whether to set the ranks for the wild cards.
       * @return {Array} Cards having the suit, including wild cards.
       */
      getCardsForFlush(suit, setRanks) {
        var cards = (this.suits[suit] || []).sort(Card.sort);
        for (var i = 0; i < this.wilds.length; i++) {
          var wild = this.wilds[i];
          if (setRanks) {
            var j = 0;
            while (j < values.length && j < cards.length) {
              if (cards[j].rank === values.length - 1 - j) {
                j += 1;
              } else {
                break;
              }
            }
            wild.rank = values.length - 1 - j;
            wild.wildValue = values[wild.rank];
          }
          cards.push(wild);
          cards = cards.sort(Card.sort);
        }
        return cards;
      }
      /**
       * Resets the rank and wild values of the wild cards.
       */
      resetWildCards() {
        for (var i = 0; i < this.wilds.length; i++) {
          this.wilds[i].rank = -1;
          this.wilds[i].wildValue = this.wilds[i].value;
        }
      }
      /**
       * Highest card comparison.
       * @return {Array} Highest cards
       */
      nextHighest() {
        var picks;
        var excluding = [];
        excluding = excluding.concat(this.cards);
        picks = this.cardPool.filter(function(card2) {
          if (excluding.indexOf(card2) < 0) {
            return true;
          }
        });
        if (this.game.wildStatus === 0) {
          for (var i = 0; i < picks.length; i++) {
            var card = picks[i];
            if (card.rank === -1) {
              card.wildValue = "A";
              card.rank = values.length - 1;
            }
          }
          picks = picks.sort(Card.sort);
        }
        return picks;
      }
      /**
       * Return list of contained cards in human readable format.
       * @return {String}
       */
      toString() {
        var cards = this.cards.map(function(c) {
          return c.toString();
        });
        return cards.join(", ");
      }
      /**
       * Return array of contained cards.
       * @return {Array}
       */
      toArray() {
        var cards = this.cards.map(function(c) {
          return c.toString();
        });
        return cards;
      }
      /**
       * Determine if qualifying hand.
       * @return {Boolean}
       */
      qualifiesHigh() {
        if (!this.game.lowestQualified || this.alwaysQualifies) {
          return true;
        }
        return this.compare(_Hand.solve(this.game.lowestQualified, this.game)) <= 0;
      }
      /**
       * Find highest ranked hands and remove any that don't qualify or lose to another hand.
       * @param  {Array} hands Hands to evaluate.
       * @return {Array}       Winning hands.
       */
      static winners(hands) {
        hands = hands.filter(function(h) {
          return h.qualifiesHigh();
        });
        var highestRank = Math.max.apply(
          Math,
          hands.map(function(h) {
            return h.rank;
          })
        );
        hands = hands.filter(function(h) {
          return h.rank === highestRank;
        });
        hands = hands.filter(function(h) {
          var lose = false;
          for (var i = 0; i < hands.length; i++) {
            lose = h.loseTo(hands[i]);
            if (lose) {
              break;
            }
          }
          return !lose;
        });
        return hands;
      }
      /**
       * Build and return the best hand.
       * @param  {Array} cards Array of cards (['Ad', '3c', 'Th', ...]).
       * @param  {String} game Game being played.
       * @param  {Boolean} canDisqualify Check for a qualified hand.
       * @return {Hand}       Best hand.
       */
      static solve(cards, game, canDisqualify) {
        game = game || "standard";
        game = typeof game === "string" ? new Game(game) : game;
        cards = cards || [""];
        var hands = game.handValues;
        var result = null;
        for (var i = 0; i < hands.length; i++) {
          result = new hands[i](cards, game, canDisqualify);
          if (result.isPossible) {
            break;
          }
        }
        return result;
      }
      /**
       * Separate cards based on if they are wild cards.
       * @param  {Array} cards Array of cards (['Ad', '3c', 'Th', ...]).
       * @param  {Game} game Game being played.
       * @return {Array} [wilds, nonWilds] Wild and non-Wild Cards.
       */
      static stripWilds(cards, game) {
        var card, wilds, nonWilds;
        cards = cards || [""];
        wilds = [];
        nonWilds = [];
        for (var i = 0; i < cards.length; i++) {
          card = cards[i];
          if (card.rank === -1) {
            wilds.push(cards[i]);
          } else {
            nonWilds.push(cards[i]);
          }
        }
        return [wilds, nonWilds];
      }
    };
    module2.exports = { Hand: Hand2 };
    var StraightFlush = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Straight Flush", game, canDisqualify);
      }
      solve() {
        var cards;
        this.resetWildCards();
        var possibleStraight = null;
        var nonCards = [];
        for (var suit in this.suits) {
          cards = this.getCardsForFlush(suit, false);
          if (cards && cards.length >= this.game.sfQualify) {
            possibleStraight = cards;
            break;
          }
        }
        if (possibleStraight) {
          if (this.game.descr !== "standard") {
            for (var suit in this.suits) {
              if (possibleStraight[0].suit !== suit) {
                nonCards = nonCards.concat(this.suits[suit] || []);
                nonCards = Hand2.stripWilds(nonCards, this.game)[1];
              }
            }
          }
          var straight = new Straight(possibleStraight, this.game);
          if (straight.isPossible) {
            this.cards = straight.cards;
            this.cards = this.cards.concat(nonCards);
            this.sfLength = straight.sfLength;
          }
        }
        if (this.cards[0] && this.cards[0].rank === 13) {
          this.descr = "Royal Flush";
        } else if (this.cards.length >= this.game.sfQualify) {
          this.descr = this.name + ", " + this.cards[0].toString().slice(0, -1) + suit + " High";
        }
        return this.cards.length >= this.game.sfQualify;
      }
    };
    var RoyalFlush = class extends StraightFlush {
      constructor(cards, game, canDisqualify) {
        super(cards, game, canDisqualify);
      }
      solve() {
        this.resetWildCards();
        var result = super.solve();
        return result && this.descr === "Royal Flush";
      }
    };
    var NaturalRoyalFlush = class extends RoyalFlush {
      constructor(cards, game, canDisqualify) {
        super(cards, game, canDisqualify);
      }
      solve() {
        var i = 0;
        this.resetWildCards();
        var result = super.solve();
        if (result && this.cards) {
          for (i = 0; i < this.game.sfQualify && i < this.cards.length; i++) {
            if (this.cards[i].value === this.game.wildValue) {
              result = false;
              this.descr = "Wild Royal Flush";
              break;
            }
          }
          if (i === this.game.sfQualify) {
            this.descr = "Royal Flush";
          }
        }
        return result;
      }
    };
    var WildRoyalFlush = class extends RoyalFlush {
      constructor(cards, game, canDisqualify) {
        super(cards, game, canDisqualify);
      }
      solve() {
        var i = 0;
        this.resetWildCards();
        var result = super.solve();
        if (result && this.cards) {
          for (i = 0; i < this.game.sfQualify && i < this.cards.length; i++) {
            if (this.cards[i].value === this.game.wildValue) {
              this.descr = "Wild Royal Flush";
              break;
            }
          }
          if (i === this.game.sfQualify) {
            result = false;
            this.descr = "Royal Flush";
          }
        }
        return result;
      }
    };
    var FiveOfAKind = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Five of a Kind", game, canDisqualify);
      }
      solve() {
        this.resetWildCards();
        for (var i = 0; i < this.values.length; i++) {
          if (this.getNumCardsByRank(i) === 5) {
            this.cards = this.values[i] || [];
            for (var j = 0; j < this.wilds.length && this.cards.length < 5; j++) {
              var wild = this.wilds[j];
              if (this.cards) {
                wild.rank = this.cards[0].rank;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            this.cards = this.cards.concat(
              this.nextHighest().slice(0, this.game.cardsInHand - 5)
            );
            break;
          }
        }
        if (this.cards.length >= 5) {
          this.descr = this.name + ", " + this.cards[0].toString().slice(0, -1) + "'s";
        }
        return this.cards.length >= 5;
      }
    };
    var FourOfAKindPairPlus = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Four of a Kind with Pair or Better", game, canDisqualify);
      }
      solve() {
        var cards;
        this.resetWildCards();
        for (var i = 0; i < this.values.length; i++) {
          if (this.getNumCardsByRank(i) === 4) {
            this.cards = this.values[i] || [];
            for (var j = 0; j < this.wilds.length && this.cards.length < 4; j++) {
              var wild = this.wilds[j];
              if (this.cards) {
                wild.rank = this.cards[0].rank;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            break;
          }
        }
        if (this.cards.length === 4) {
          for (i = 0; i < this.values.length; i++) {
            cards = this.values[i];
            if (cards && this.cards[0].wildValue === cards[0].wildValue) {
              continue;
            }
            if (this.getNumCardsByRank(i) >= 2) {
              this.cards = this.cards.concat(cards || []);
              for (var j = 0; j < this.wilds.length; j++) {
                var wild = this.wilds[j];
                if (wild.rank !== -1) {
                  continue;
                }
                if (cards) {
                  wild.rank = cards[0].rank;
                } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                  wild.rank = values.length - 2;
                } else {
                  wild.rank = values.length - 1;
                }
                wild.wildValue = values[wild.rank];
                this.cards.push(wild);
              }
              this.cards = this.cards.concat(
                this.nextHighest().slice(0, this.game.cardsInHand - 6)
              );
              break;
            }
          }
        }
        if (this.cards.length >= 6) {
          var type = this.cards[0].toString().slice(0, -1) + "'s over " + this.cards[4].toString().slice(0, -1) + "'s";
          this.descr = this.name + ", " + type;
        }
        return this.cards.length >= 6;
      }
    };
    var FourOfAKind = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Four of a Kind", game, canDisqualify);
      }
      solve() {
        this.resetWildCards();
        for (var i = 0; i < this.values.length; i++) {
          if (this.getNumCardsByRank(i) === 4) {
            this.cards = this.values[i] || [];
            for (var j = 0; j < this.wilds.length && this.cards.length < 4; j++) {
              var wild = this.wilds[j];
              if (this.cards) {
                wild.rank = this.cards[0].rank;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            this.cards = this.cards.concat(
              this.nextHighest().slice(0, this.game.cardsInHand - 4)
            );
            break;
          }
        }
        if (this.cards.length >= 4) {
          if (this.game.noKickers) {
            this.cards.length = 4;
          }
          this.descr = this.name + ", " + this.cards[0].toString().slice(0, -1) + "'s";
        }
        return this.cards.length >= 4;
      }
    };
    var FourWilds = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Four Wild Cards", game, canDisqualify);
      }
      solve() {
        if (this.wilds.length === 4) {
          this.cards = this.wilds;
          this.cards = this.cards.concat(
            this.nextHighest().slice(0, this.game.cardsInHand - 4)
          );
        }
        if (this.cards.length >= 4) {
          if (this.game.noKickers) {
            this.cards.length = 4;
          }
          this.descr = this.name;
        }
        return this.cards.length >= 4;
      }
    };
    var ThreeOfAKindTwoPair = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Three of a Kind with Two Pair", game, canDisqualify);
      }
      solve() {
        var cards;
        this.resetWildCards();
        for (var i = 0; i < this.values.length; i++) {
          if (this.getNumCardsByRank(i) === 3) {
            this.cards = this.values[i] || [];
            for (var j = 0; j < this.wilds.length && this.cards.length < 3; j++) {
              var wild = this.wilds[j];
              if (this.cards) {
                wild.rank = this.cards[0].rank;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            break;
          }
        }
        if (this.cards.length === 3) {
          for (var i = 0; i < this.values.length; i++) {
            var cards = this.values[i];
            if (cards && this.cards[0].wildValue === cards[0].wildValue) {
              continue;
            }
            if (this.cards.length > 5 && this.getNumCardsByRank(i) === 2) {
              this.cards = this.cards.concat(cards || []);
              for (var j = 0; j < this.wilds.length; j++) {
                var wild = this.wilds[j];
                if (wild.rank !== -1) {
                  continue;
                }
                if (cards) {
                  wild.rank = cards[0].rank;
                } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                  wild.rank = values.length - 2;
                } else {
                  wild.rank = values.length - 1;
                }
                wild.wildValue = values[wild.rank];
                this.cards.push(wild);
              }
              this.cards = this.cards.concat(
                this.nextHighest().slice(0, this.game.cardsInHand - 4)
              );
              break;
            } else if (this.getNumCardsByRank(i) === 2) {
              this.cards = this.cards.concat(cards);
              for (var j = 0; j < this.wilds.length; j++) {
                var wild = this.wilds[j];
                if (wild.rank !== -1) {
                  continue;
                }
                if (cards) {
                  wild.rank = cards[0].rank;
                } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                  wild.rank = values.length - 2;
                } else {
                  wild.rank = values.length - 1;
                }
                wild.wildValue = values[wild.rank];
                this.cards.push(wild);
              }
            }
          }
        }
        if (this.cards.length >= 7) {
          var type = this.cards[0].toString().slice(0, -1) + "'s over " + this.cards[3].toString().slice(0, -1) + "'s & " + this.cards[5].value + "'s";
          this.descr = this.name + ", " + type;
        }
        return this.cards.length >= 7;
      }
    };
    var FullHouse = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Full House", game, canDisqualify);
      }
      solve() {
        var cards;
        this.resetWildCards();
        for (var i = 0; i < this.values.length; i++) {
          if (this.getNumCardsByRank(i) === 3) {
            this.cards = this.values[i] || [];
            for (var j = 0; j < this.wilds.length && this.cards.length < 3; j++) {
              var wild = this.wilds[j];
              if (this.cards) {
                wild.rank = this.cards[0].rank;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            break;
          }
        }
        if (this.cards.length === 3) {
          for (i = 0; i < this.values.length; i++) {
            cards = this.values[i];
            if (cards && this.cards[0].wildValue === cards[0].wildValue) {
              continue;
            }
            if (this.getNumCardsByRank(i) >= 2) {
              this.cards = this.cards.concat(cards || []);
              for (var j = 0; j < this.wilds.length; j++) {
                var wild = this.wilds[j];
                if (wild.rank !== -1) {
                  continue;
                }
                if (cards) {
                  wild.rank = cards[0].rank;
                } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                  wild.rank = values.length - 2;
                } else {
                  wild.rank = values.length - 1;
                }
                wild.wildValue = values[wild.rank];
                this.cards.push(wild);
              }
              this.cards = this.cards.concat(
                this.nextHighest().slice(0, this.game.cardsInHand - 5)
              );
              break;
            }
          }
        }
        if (this.cards.length >= 5) {
          var type = this.cards[0].toString().slice(0, -1) + "'s over " + this.cards[3].toString().slice(0, -1) + "'s";
          this.descr = this.name + ", " + type;
        }
        return this.cards.length >= 5;
      }
    };
    var Flush = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Flush", game, canDisqualify);
      }
      solve() {
        this.sfLength = 0;
        this.resetWildCards();
        for (var suit in this.suits) {
          var cards = this.getCardsForFlush(suit, true);
          if (cards.length >= this.game.sfQualify) {
            this.cards = cards;
            break;
          }
        }
        if (this.cards.length >= this.game.sfQualify) {
          this.descr = this.name + ", " + this.cards[0].toString().slice(0, -1) + suit + " High";
          this.sfLength = this.cards.length;
          if (this.cards.length < this.game.cardsInHand) {
            this.cards = this.cards.concat(
              this.nextHighest().slice(0, this.game.cardsInHand - this.cards.length)
            );
          }
        }
        return this.cards.length >= this.game.sfQualify;
      }
    };
    var Straight = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Straight", game, canDisqualify);
      }
      solve() {
        var card, checkCards;
        this.resetWildCards();
        if (this.game.wheelStatus === 1) {
          this.cards = this.getWheel();
          if (this.cards.length) {
            var wildCount = 0;
            for (var i = 0; i < this.cards.length; i++) {
              card = this.cards[i];
              if (card.value === this.game.wildValue) {
                wildCount += 1;
              }
              if (card.rank === 0) {
                card.rank = values.indexOf("A");
                card.wildValue = "A";
                if (card.value === "1") {
                  card.value = "A";
                }
              }
            }
            this.cards = this.cards.sort(Card.sort);
            for (; wildCount < this.wilds.length && this.cards.length < this.game.cardsInHand; wildCount++) {
              card = this.wilds[wildCount];
              card.rank = values.indexOf("A");
              card.wildValue = "A";
              this.cards.push(card);
            }
            this.descr = this.name + ", Wheel";
            this.sfLength = this.sfQualify;
            if (this.cards[0].value === "A") {
              this.cards = this.cards.concat(
                this.nextHighest().slice(
                  1,
                  this.game.cardsInHand - this.cards.length + 1
                )
              );
            } else {
              this.cards = this.cards.concat(
                this.nextHighest().slice(
                  0,
                  this.game.cardsInHand - this.cards.length
                )
              );
            }
            return true;
          }
          this.resetWildCards();
        }
        this.cards = this.getGaps();
        for (var i = 0; i < this.wilds.length; i++) {
          card = this.wilds[i];
          checkCards = this.getGaps(this.cards.length);
          if (this.cards.length === checkCards.length) {
            if (this.cards[0].rank < values.length - 1) {
              card.rank = this.cards[0].rank + 1;
              card.wildValue = values[card.rank];
              this.cards.push(card);
            } else {
              card.rank = this.cards[this.cards.length - 1].rank - 1;
              card.wildValue = values[card.rank];
              this.cards.push(card);
            }
          } else {
            for (var j = 1; j < this.cards.length; j++) {
              if (this.cards[j - 1].rank - this.cards[j].rank > 1) {
                card.rank = this.cards[j - 1].rank - 1;
                card.wildValue = values[card.rank];
                this.cards.push(card);
                break;
              }
            }
          }
          this.cards = this.cards.sort(Card.sort);
        }
        if (this.cards.length >= this.game.sfQualify) {
          this.descr = this.name + ", " + this.cards[0].toString().slice(0, -1) + " High";
          this.cards = this.cards.slice(0, this.game.cardsInHand);
          this.sfLength = this.cards.length;
          if (this.cards.length < this.game.cardsInHand) {
            if (this.cards[this.sfLength - 1].rank === 0) {
              this.cards = this.cards.concat(
                this.nextHighest().slice(
                  1,
                  this.game.cardsInHand - this.cards.length + 1
                )
              );
            } else {
              this.cards = this.cards.concat(
                this.nextHighest().slice(
                  0,
                  this.game.cardsInHand - this.cards.length
                )
              );
            }
          }
        }
        return this.cards.length >= this.game.sfQualify;
      }
      /**
       * Get the number of gaps in the straight.
       * @return {Array} Highest potential straight with fewest number of gaps.
       */
      getGaps(checkHandLength) {
        var wildCards, cardsToCheck, i, card, gapCards, cardsList, gapCount, prevCard, diff;
        var stripReturn = Hand2.stripWilds(this.cardPool, this.game);
        wildCards = stripReturn[0];
        cardsToCheck = stripReturn[1];
        for (i = 0; i < cardsToCheck.length; i++) {
          card = cardsToCheck[i];
          if (card.wildValue === "A") {
            cardsToCheck.push(new Card("1" + card.suit));
          }
        }
        cardsToCheck = cardsToCheck.sort(Card.sort);
        if (checkHandLength) {
          i = cardsToCheck[0].rank + 1;
        } else {
          checkHandLength = this.game.sfQualify;
          i = values.length;
        }
        gapCards = [];
        for (; i > 0; i--) {
          cardsList = [];
          gapCount = 0;
          for (var j = 0; j < cardsToCheck.length; j++) {
            card = cardsToCheck[j];
            if (card.rank > i) {
              continue;
            }
            prevCard = cardsList[cardsList.length - 1];
            diff = prevCard ? prevCard.rank - card.rank : i - card.rank;
            if (diff === null) {
              cardsList.push(card);
            } else if (checkHandLength < gapCount + diff + cardsList.length) {
              break;
            } else if (diff > 0) {
              cardsList.push(card);
              gapCount += diff - 1;
            }
          }
          if (cardsList.length > gapCards.length) {
            gapCards = cardsList.slice();
          }
          if (this.game.sfQualify - gapCards.length <= wildCards.length) {
            break;
          }
        }
        return gapCards;
      }
      getWheel() {
        var wildCards, cardsToCheck, i, card, wheelCards, wildCount, cardFound;
        var stripReturn = Hand2.stripWilds(this.cardPool, this.game);
        wildCards = stripReturn[0];
        cardsToCheck = stripReturn[1];
        for (i = 0; i < cardsToCheck.length; i++) {
          card = cardsToCheck[i];
          if (card.wildValue === "A") {
            cardsToCheck.push(new Card("1" + card.suit));
          }
        }
        cardsToCheck = cardsToCheck.sort(Card.sort);
        wheelCards = [];
        wildCount = 0;
        for (i = this.game.sfQualify - 1; i >= 0; i--) {
          cardFound = false;
          for (var j = 0; j < cardsToCheck.length; j++) {
            card = cardsToCheck[j];
            if (card.rank > i) {
              continue;
            }
            if (card.rank < i) {
              break;
            }
            wheelCards.push(card);
            cardFound = true;
            break;
          }
          if (!cardFound) {
            if (wildCount < wildCards.length) {
              wildCards[wildCount].rank = i;
              wildCards[wildCount].wildValue = values[i];
              wheelCards.push(wildCards[wildCount]);
              wildCount += 1;
            } else {
              return [];
            }
          }
        }
        return wheelCards;
      }
    };
    var TwoThreeOfAKind = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Two Three Of a Kind", game, canDisqualify);
      }
      solve() {
        this.resetWildCards();
        for (var i = 0; i < this.values.length; i++) {
          var cards = this.values[i];
          if (this.cards.length > 0 && this.getNumCardsByRank(i) === 3) {
            this.cards = this.cards.concat(cards || []);
            for (var j = 0; j < this.wilds.length; j++) {
              var wild = this.wilds[j];
              if (wild.rank !== -1) {
                continue;
              }
              if (cards) {
                wild.rank = cards[0].rank;
              } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                wild.rank = values.length - 2;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            this.cards = this.cards.concat(
              this.nextHighest().slice(0, this.game.cardsInHand - 6)
            );
            break;
          } else if (this.getNumCardsByRank(i) === 3) {
            this.cards = this.cards.concat(cards);
            for (var j = 0; j < this.wilds.length; j++) {
              var wild = this.wilds[j];
              if (wild.rank !== -1) {
                continue;
              }
              if (cards) {
                wild.rank = cards[0].rank;
              } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                wild.rank = values.length - 2;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
          }
        }
        if (this.cards.length >= 6) {
          var type = this.cards[0].toString().slice(0, -1) + "'s & " + this.cards[3].toString().slice(0, -1) + "'s";
          this.descr = this.name + ", " + type;
        }
        return this.cards.length >= 6;
      }
    };
    var ThreeOfAKind = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Three of a Kind", game, canDisqualify);
      }
      solve() {
        this.resetWildCards();
        for (var i = 0; i < this.values.length; i++) {
          if (this.getNumCardsByRank(i) === 3) {
            this.cards = this.values[i] || [];
            for (var j = 0; j < this.wilds.length && this.cards.length < 3; j++) {
              var wild = this.wilds[j];
              if (this.cards) {
                wild.rank = this.cards[0].rank;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            this.cards = this.cards.concat(
              this.nextHighest().slice(0, this.game.cardsInHand - 3)
            );
            break;
          }
        }
        if (this.cards.length >= 3) {
          if (this.game.noKickers) {
            this.cards.length = 3;
          }
          this.descr = this.name + ", " + this.cards[0].toString().slice(0, -1) + "'s";
        }
        return this.cards.length >= 3;
      }
    };
    var ThreePair = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Three Pair", game, canDisqualify);
      }
      solve() {
        this.resetWildCards();
        for (var i = 0; i < this.values.length; i++) {
          var cards = this.values[i];
          if (this.cards.length > 2 && this.getNumCardsByRank(i) === 2) {
            this.cards = this.cards.concat(cards || []);
            for (var j = 0; j < this.wilds.length; j++) {
              var wild = this.wilds[j];
              if (wild.rank !== -1) {
                continue;
              }
              if (cards) {
                wild.rank = cards[0].rank;
              } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                wild.rank = values.length - 2;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            this.cards = this.cards.concat(
              this.nextHighest().slice(0, this.game.cardsInHand - 6)
            );
            break;
          } else if (this.cards.length > 0 && this.getNumCardsByRank(i) === 2) {
            this.cards = this.cards.concat(cards || []);
            for (var j = 0; j < this.wilds.length; j++) {
              var wild = this.wilds[j];
              if (wild.rank !== -1) {
                continue;
              }
              if (cards) {
                wild.rank = cards[0].rank;
              } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                wild.rank = values.length - 2;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
          } else if (this.getNumCardsByRank(i) === 2) {
            this.cards = this.cards.concat(cards);
            for (var j = 0; j < this.wilds.length; j++) {
              var wild = this.wilds[j];
              if (wild.rank !== -1) {
                continue;
              }
              if (cards) {
                wild.rank = cards[0].rank;
              } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                wild.rank = values.length - 2;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
          }
        }
        if (this.cards.length >= 6) {
          var type = this.cards[0].toString().slice(0, -1) + "'s & " + this.cards[2].toString().slice(0, -1) + "'s & " + this.cards[4].toString().slice(0, -1) + "'s";
          this.descr = this.name + ", " + type;
        }
        return this.cards.length >= 6;
      }
    };
    var TwoPair = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Two Pair", game, canDisqualify);
      }
      solve() {
        this.resetWildCards();
        for (var i = 0; i < this.values.length; i++) {
          var cards = this.values[i];
          if (this.cards.length > 0 && this.getNumCardsByRank(i) === 2) {
            this.cards = this.cards.concat(cards || []);
            for (var j = 0; j < this.wilds.length; j++) {
              var wild = this.wilds[j];
              if (wild.rank !== -1) {
                continue;
              }
              if (cards) {
                wild.rank = cards[0].rank;
              } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                wild.rank = values.length - 2;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            this.cards = this.cards.concat(
              this.nextHighest().slice(0, this.game.cardsInHand - 4)
            );
            break;
          } else if (this.getNumCardsByRank(i) === 2) {
            this.cards = this.cards.concat(cards);
            for (var j = 0; j < this.wilds.length; j++) {
              var wild = this.wilds[j];
              if (wild.rank !== -1) {
                continue;
              }
              if (cards) {
                wild.rank = cards[0].rank;
              } else if (this.cards[0].rank === values.length - 1 && this.game.wildStatus === 1) {
                wild.rank = values.length - 2;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
          }
        }
        if (this.cards.length >= 4) {
          if (this.game.noKickers) {
            this.cards.length = 4;
          }
          var type = this.cards[0].toString().slice(0, -1) + "'s & " + this.cards[2].toString().slice(0, -1) + "'s";
          this.descr = this.name + ", " + type;
        }
        return this.cards.length >= 4;
      }
    };
    var OnePair = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "Pair", game, canDisqualify);
      }
      solve() {
        this.resetWildCards();
        for (var i = 0; i < this.values.length; i++) {
          if (this.getNumCardsByRank(i) === 2) {
            this.cards = this.cards.concat(this.values[i] || []);
            for (var j = 0; j < this.wilds.length && this.cards.length < 2; j++) {
              var wild = this.wilds[j];
              if (this.cards) {
                wild.rank = this.cards[0].rank;
              } else {
                wild.rank = values.length - 1;
              }
              wild.wildValue = values[wild.rank];
              this.cards.push(wild);
            }
            this.cards = this.cards.concat(
              this.nextHighest().slice(0, this.game.cardsInHand - 2)
            );
            break;
          }
        }
        if (this.cards.length >= 2) {
          if (this.game.noKickers) {
            this.cards.length = 2;
          }
          this.descr = this.name + ", " + this.cards[0].toString().slice(0, -1) + "'s";
        }
        return this.cards.length >= 2;
      }
    };
    var HighCard = class extends Hand2 {
      constructor(cards, game, canDisqualify) {
        super(cards, "High Card", game, canDisqualify);
      }
      solve() {
        this.cards = this.cardPool.slice(0, this.game.cardsInHand);
        for (var i = 0; i < this.cards.length; i++) {
          var card = this.cards[i];
          if (this.cards[i].value === this.game.wildValue) {
            this.cards[i].wildValue = "A";
            this.cards[i].rank = values.indexOf("A");
          }
        }
        if (this.game.noKickers) {
          this.cards.length = 1;
        }
        this.cards = this.cards.sort(Card.sort);
        this.descr = this.cards[0].toString().slice(0, -1) + " High";
        return true;
      }
    };
    var gameRules = {
      standard: {
        cardsInHand: 5,
        handValues: [
          StraightFlush,
          FourOfAKind,
          FullHouse,
          Flush,
          Straight,
          ThreeOfAKind,
          TwoPair,
          OnePair,
          HighCard
        ],
        wildValue: null,
        wildStatus: 1,
        wheelStatus: 0,
        sfQualify: 5,
        lowestQualified: null,
        noKickers: false
      },
      jacksbetter: {
        cardsInHand: 5,
        handValues: [
          StraightFlush,
          FourOfAKind,
          FullHouse,
          Flush,
          Straight,
          ThreeOfAKind,
          TwoPair,
          OnePair,
          HighCard
        ],
        wildValue: null,
        wildStatus: 1,
        wheelStatus: 0,
        sfQualify: 5,
        lowestQualified: ["Jc", "Jd", "4h", "3s", "2c"],
        noKickers: true
      },
      joker: {
        cardsInHand: 5,
        handValues: [
          NaturalRoyalFlush,
          FiveOfAKind,
          WildRoyalFlush,
          StraightFlush,
          FourOfAKind,
          FullHouse,
          Flush,
          Straight,
          ThreeOfAKind,
          TwoPair,
          HighCard
        ],
        wildValue: "O",
        wildStatus: 1,
        wheelStatus: 0,
        sfQualify: 5,
        lowestQualified: ["4c", "3d", "3h", "2s", "2c"],
        noKickers: true
      },
      deuceswild: {
        cardsInHand: 5,
        handValues: [
          NaturalRoyalFlush,
          FourWilds,
          WildRoyalFlush,
          FiveOfAKind,
          StraightFlush,
          FourOfAKind,
          FullHouse,
          Flush,
          Straight,
          ThreeOfAKind,
          HighCard
        ],
        wildValue: "2",
        wildStatus: 1,
        wheelStatus: 0,
        sfQualify: 5,
        lowestQualified: ["5c", "4d", "3h", "3s", "3c"],
        noKickers: true
      },
      threecard: {
        cardsInHand: 3,
        handValues: [
          StraightFlush,
          ThreeOfAKind,
          Straight,
          Flush,
          OnePair,
          HighCard
        ],
        wildValue: null,
        wildStatus: 1,
        wheelStatus: 0,
        sfQualify: 3,
        lowestQualified: ["Qh", "3s", "2c"],
        noKickers: false
      },
      fourcard: {
        cardsInHand: 4,
        handValues: [
          FourOfAKind,
          StraightFlush,
          ThreeOfAKind,
          Flush,
          Straight,
          TwoPair,
          OnePair,
          HighCard
        ],
        wildValue: null,
        wildStatus: 1,
        wheelStatus: 0,
        sfQualify: 4,
        lowestQualified: null,
        noKickers: true
      },
      fourcardbonus: {
        cardsInHand: 4,
        handValues: [
          FourOfAKind,
          StraightFlush,
          ThreeOfAKind,
          Flush,
          Straight,
          TwoPair,
          OnePair,
          HighCard
        ],
        wildValue: null,
        wildStatus: 1,
        wheelStatus: 0,
        sfQualify: 4,
        lowestQualified: ["Ac", "Ad", "3h", "2s"],
        noKickers: true
      },
      paigowpokerfull: {
        cardsInHand: 7,
        handValues: [
          FiveOfAKind,
          FourOfAKindPairPlus,
          StraightFlush,
          Flush,
          Straight,
          FourOfAKind,
          TwoThreeOfAKind,
          ThreeOfAKindTwoPair,
          FullHouse,
          ThreeOfAKind,
          ThreePair,
          TwoPair,
          OnePair,
          HighCard
        ],
        wildValue: "O",
        wildStatus: 0,
        wheelStatus: 1,
        sfQualify: 5,
        lowestQualified: null
      },
      paigowpokeralt: {
        cardsInHand: 7,
        handValues: [
          FourOfAKind,
          FullHouse,
          ThreeOfAKind,
          ThreePair,
          TwoPair,
          OnePair,
          HighCard
        ],
        wildValue: "O",
        wildStatus: 0,
        wheelStatus: 1,
        sfQualify: 5,
        lowestQualified: null
      },
      paigowpokersf6: {
        cardsInHand: 7,
        handValues: [StraightFlush, Flush, Straight],
        wildValue: "O",
        wildStatus: 0,
        wheelStatus: 1,
        sfQualify: 6,
        lowestQualified: null
      },
      paigowpokersf7: {
        cardsInHand: 7,
        handValues: [StraightFlush, Flush, Straight],
        wildValue: "O",
        wildStatus: 0,
        wheelStatus: 1,
        sfQualify: 7,
        lowestQualified: null
      },
      paigowpokerhi: {
        cardsInHand: 5,
        handValues: [
          FiveOfAKind,
          StraightFlush,
          FourOfAKind,
          FullHouse,
          Flush,
          Straight,
          ThreeOfAKind,
          TwoPair,
          OnePair,
          HighCard
        ],
        wildValue: "O",
        wildStatus: 0,
        wheelStatus: 1,
        sfQualify: 5,
        lowestQualified: null
      },
      paigowpokerlo: {
        cardsInHand: 2,
        handValues: [OnePair, HighCard],
        wildValue: "O",
        wildStatus: 0,
        wheelStatus: 1,
        sfQualify: 5,
        lowestQualified: null
      }
    };
    var Game = class {
      constructor(descr) {
        this.descr = descr;
        this.cardsInHand = 0;
        this.handValues = [];
        this.wildValue = null;
        this.wildStatus = 0;
        this.wheelStatus = 0;
        this.sfQualify = 5;
        this.lowestQualified = null;
        this.noKickers = null;
        if (!this.descr || !gameRules[this.descr]) {
          this.descr = "standard";
        }
        this.cardsInHand = gameRules[this.descr]["cardsInHand"];
        this.handValues = gameRules[this.descr]["handValues"];
        this.wildValue = gameRules[this.descr]["wildValue"];
        this.wildStatus = gameRules[this.descr]["wildStatus"];
        this.wheelStatus = gameRules[this.descr]["wheelStatus"];
        this.sfQualify = gameRules[this.descr]["sfQualify"];
        this.lowestQualified = gameRules[this.descr]["lowestQualified"];
        this.noKickers = gameRules[this.descr]["noKickers"];
      }
    };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  TexasHoldem: () => TexasHoldem
});
module.exports = __toCommonJS(src_exports);

// src/Player.ts
var Player = class {
  constructor(name, cards) {
    this.name = name;
    this.cards = cards;
  }
};

// src/index.ts
var import_pokersolver = __toESM(require_pokersolver());
var TexasHoldem = class {
  constructor(numSimulations) {
    this.numOpponents = 0;
    this.opponents = [];
    this.player = new Player("You", []);
    this.table = [];
    this.deadCards = 0;
    // the number of unknown dead cards
    // used to check for duplicates
    // prettier-ignore
    this.deck = {
      "As": true,
      "Ah": true,
      "Ad": true,
      "Ac": true,
      "2s": true,
      "2h": true,
      "2d": true,
      "2c": true,
      "3s": true,
      "3h": true,
      "3d": true,
      "3c": true,
      "4s": true,
      "4h": true,
      "4d": true,
      "4c": true,
      "5s": true,
      "5h": true,
      "5d": true,
      "5c": true,
      "6s": true,
      "6h": true,
      "6d": true,
      "6c": true,
      "7s": true,
      "7h": true,
      "7d": true,
      "7c": true,
      "8s": true,
      "8h": true,
      "8d": true,
      "8c": true,
      "9s": true,
      "9h": true,
      "9d": true,
      "9c": true,
      "Ts": true,
      "Th": true,
      "Td": true,
      "Tc": true,
      "Js": true,
      "Jh": true,
      "Jd": true,
      "Jc": true,
      "Qs": true,
      "Qh": true,
      "Qd": true,
      "Qc": true,
      "Ks": true,
      "Kh": true,
      "Kd": true,
      "Kc": true
    };
    this.numSimulations = numSimulations || 1e4;
  }
  // couldn't remove the card return false as there is a duplicate
  removeCard(card) {
    if (this.deck[card]) {
      this.deck[card] = false;
      return true;
    }
    return false;
  }
  setPlayer(cards, name) {
    if (cards.length == 1) {
      throw new Error("You must have 2 cards");
    }
    for (let i = 0; i < cards.length; i++) {
      if (!this.removeCard(cards[i])) {
        throw new Error(`You: [${cards}], has a duplicate card: ${cards[i]}`);
      }
    }
    this.player = new Player(name || "You", cards);
  }
  addOpponent(cards, options) {
    if (this.numOpponents >= 9) {
      throw new Error("You can only have 9 opponents");
    }
    let name = options == null ? void 0 : options.name;
    if (!name) {
      name = "Opponent " + (this.numOpponents + 1);
    }
    if (cards.length > 2) {
      throw new Error(`${name} can only have 2 cards`);
    }
    if (cards.length == 1) {
      throw new Error(`${name} must have 2 cards`);
    }
    for (let i = 0; i < cards.length; i++) {
      if (!this.removeCard(cards[i])) {
        throw new Error(
          `${name}: [${cards}], has a duplicate card: ${cards[i]}`
        );
      }
    }
    if ((options == null ? void 0 : options.folded) && cards.length == 0) {
      this.deadCards += 2;
    } else {
      const player = new Player(name, cards);
      this.opponents.push(player);
      this.numOpponents++;
    }
  }
  setTable(cards) {
    for (let i = 0; i < cards.length; i++) {
      if (!this.removeCard(cards[i])) {
        throw new Error(`Table: [${cards}], has a duplicate card: ${cards[i]}`);
      }
    }
    this.table = cards;
  }
  calculate() {
    var _a;
    if (this.opponents.length == 0) {
      throw new Error(
        "You have no opponents. Add an opponent with addOpponent()"
      );
    }
    let results = this.runSimulation(this.player.cards, this.table);
    function frequencies(arr) {
      const result = {};
      return arr.reduce((acc, curr) => {
        var _a2;
        acc[curr] = ((_a2 = acc[curr]) != null ? _a2 : 0) + 1;
        if (acc[curr] >= 3) {
          result[curr] = acc[curr];
        }
        return acc;
      }, {});
    }
    let yourHandFrequencies = frequencies(results.yourhandnames);
    for (let [key, value] of Object.entries(yourHandFrequencies)) {
      yourHandFrequencies[key] = (value != null ? value : 0) / this.numSimulations;
    }
    let oppHandFrequencies = frequencies(results.oppshandnames);
    for (let [key, value] of Object.entries(oppHandFrequencies)) {
      oppHandFrequencies[key] = (value != null ? value : 0) / this.numSimulations / this.numOpponents;
    }
    let namedOppHandFrequencies = {};
    for (const player of this.opponents) {
      namedOppHandFrequencies[player.name] = frequencies(
        results.namedOppHandNames[player.name]
      );
    }
    let namedOppHandChances = {};
    for (const player of this.opponents) {
      namedOppHandChances[player.name] = {};
      for (let [key, value] of Object.entries(
        namedOppHandFrequencies[player.name]
      )) {
        namedOppHandChances[player.name][key] = (value != null ? value : 0) / this.numSimulations;
      }
    }
    let winnerFrequencies = frequencies(results.winners);
    let winnerChances = {
      [this.player.name]: ((_a = winnerFrequencies[0]) != null ? _a : 0) / this.numSimulations
    };
    for (let i = 0; i < this.numOpponents; i++) {
      const value = winnerFrequencies[i + 1];
      winnerChances[this.opponents[i].name] = (value != null ? value : 0) / this.numSimulations;
    }
    return {
      winChance: results.won,
      loseChance: results.lost,
      tieChance: results.tied,
      yourHandChances: yourHandFrequencies,
      oppHandChances: oppHandFrequencies,
      namedOppHandChances,
      winnerChances
    };
  }
  runSimulation(master_yourcards, master_tablecards) {
    let num_times_you_won = 0;
    let num_times_you_tied = 0;
    let num_times_you_lost = 0;
    const yourhandnames = [];
    const opponenthandnames = [];
    const all_winners = [];
    let namedOppHandNames = {};
    for (let i = 0; i < this.numOpponents; i++) {
      namedOppHandNames[this.opponents[i].name] = [];
    }
    for (let simnum = 0; simnum < this.numSimulations; simnum++) {
      let deckDict = __spreadValues({}, this.deck);
      let keys = Object.keys(deckDict);
      for (let i = 0; i < this.deadCards; i++) {
        let randomKey = keys[Math.floor(Math.random() * keys.length)];
        while (!deckDict[randomKey]) {
          randomKey = keys[Math.floor(Math.random() * keys.length)];
        }
        deckDict[randomKey] = false;
      }
      let deck = [];
      for (let key in deckDict) {
        if (deckDict[key]) {
          deck.push(key);
        }
      }
      let yourcards = master_yourcards.slice();
      let tablecards = master_tablecards.slice();
      while (tablecards.length < 5) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        tablecards.push(deck[randomIndex]);
        deck.splice(randomIndex, 1);
      }
      let opponents = [];
      for (const opp of this.opponents) {
        const copiedOpp = new Player(opp.name, opp.cards.slice());
        while (copiedOpp.cards.length < 2) {
          const randomIndex = Math.floor(Math.random() * deck.length);
          copiedOpp.cards.push(deck[randomIndex]);
          deck.splice(randomIndex, 1);
        }
        opponents.push(copiedOpp);
      }
      let hands = [];
      let yourhand = import_pokersolver.Hand.solve(yourcards.concat(tablecards));
      yourhand.id = 0;
      hands.push(yourhand);
      yourhandnames.push(yourhand.name);
      for (let i = 0; i < opponents.length; i++) {
        let opphand = import_pokersolver.Hand.solve(opponents[i].cards.concat(tablecards));
        opphand.id = i + 1;
        hands.push(opphand);
        opponenthandnames.push(opphand.name);
        namedOppHandNames[opponents[i].name].push(opphand.name);
      }
      let winners = import_pokersolver.Hand.winners(hands).map((hand) => hand.id);
      if (winners.length === 1) {
        let winner = winners[0];
        all_winners.push(winner);
        if (winner === 0) {
          num_times_you_won++;
        } else {
          num_times_you_lost++;
        }
      } else {
        if (winners.includes(0)) {
          num_times_you_tied++;
        } else {
          num_times_you_lost++;
        }
      }
    }
    return {
      won: num_times_you_won / this.numSimulations,
      lost: num_times_you_lost / this.numSimulations,
      tied: num_times_you_tied / this.numSimulations,
      yourhandnames,
      oppshandnames: opponenthandnames,
      namedOppHandNames,
      winners: all_winners
    };
  }
  // in order to use this, the board must be set first
  solveHand(cards) {
    const board = this.table.slice();
    for (const card of board) {
      if (cards.includes(card)) {
        throw new Error(
          `SolveHand: The board: [${board}], has a duplicate card: ${card}`
        );
      }
    }
    board.push(...cards);
    return import_pokersolver.Hand.solve(board);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TexasHoldem
});
