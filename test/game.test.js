const assert = require("assert");
const { BlackjackGame, createDeck, scoreHand } = require("../src/model/dealer.model");

const card = rank => ({ rank, suit: "spades" });
assert.deepStrictEqual(scoreHand([card("A"), card("6")]), { total: 17, soft: true, blackjack: false, bust: false });
assert.strictEqual(scoreHand([card("A"), card("A"), card("9")]).total, 21);
assert.strictEqual(scoreHand([card("A"), card("K")]).blackjack, true);
assert.strictEqual(scoreHand([card("K"), card("Q"), card("2")]).bust, true);
assert.strictEqual(new Set(createDeck(() => 0.5).map(item => `${item.rank}-${item.suit}`)).size, 52);

const game = new BlackjackGame({ bankroll: 100, random: () => 0.5 });
assert.strictEqual(game.hit(), false, "cannot hit before deal");
assert.strictEqual(game.setBet(25), true);
assert.strictEqual(game.deal(), true);
assert.strictEqual(game.deal(), false, "cannot redeal during a hand");

const active = new BlackjackGame({ bankroll: 100 });
active.bet = 20;
active.bankroll = 80;
active.phase = "playing";
active.player = [card("8"), card("3")];
active.dealer = [card("10"), card("6")];
active.deck = [card("5"), card("2")];
assert.strictEqual(active.canDouble(), true);
active.hit();
assert.strictEqual(active.canDouble(), false, "cannot double after a hit");
assert.strictEqual(active.dealer.length, 2, "hit does not play dealer");

const dealerRound = new BlackjackGame({ bankroll: 80 });
dealerRound.bet = 20;
dealerRound.phase = "playing";
dealerRound.player = [card("10"), card("8")];
dealerRound.dealer = [card("10"), card("6")];
dealerRound.deck = [card("5")];
dealerRound.stand();
assert.strictEqual(dealerRound.dealer.length, 3, "dealer draws below 17");
assert.strictEqual(dealerRound.phase, "finished");
assert.strictEqual(dealerRound.bankroll, 80, "dealer win does not return wager");

const natural = new BlackjackGame({ bankroll: 75 });
natural.bet = 20;
natural.phase = "playing";
natural.settleNaturals(scoreHand([card("A"), card("K")]), scoreHand([card("10"), card("9")]));
assert.strictEqual(natural.bankroll, 125, "blackjack returns wager plus 3:2 winnings");

console.log("Game rule tests passed.");
