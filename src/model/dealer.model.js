const SUITS = ["clubs", "diamonds", "hearts", "spades"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function createDeck(random = Math.random) {
  const deck = [];
  SUITS.forEach(suit => RANKS.forEach(rank => deck.push({ suit, rank })));
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck;
}

function scoreHand(hand) {
  let total = 0;
  let aces = 0;
  hand.forEach(card => {
    if (card.rank === "A") {
      total += 11;
      aces += 1;
    } else {
      total += ["J", "Q", "K"].includes(card.rank) ? 10 : Number(card.rank);
    }
  });
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return { total, soft: aces > 0, blackjack: hand.length === 2 && total === 21, bust: total > 21 };
}

class BlackjackGame {
  constructor({ bankroll = 500, random = Math.random } = {}) {
    this.bankroll = bankroll;
    this.random = random;
    this.bet = 0;
    this.phase = "betting";
    this.message = "Choose a wager to begin.";
    this.player = [];
    this.dealer = [];
    this.deck = [];
  }

  setBet(amount) {
    if (this.phase !== "betting") return false;
    const value = Number(amount);
    if (!Number.isInteger(value) || value < 5 || value > this.bankroll) return false;
    this.bet = value;
    this.message = `Wager set to $${value}. Deal when ready.`;
    return true;
  }

  deal() {
    if (this.phase !== "betting" || this.bet < 5 || this.bet > this.bankroll) return false;
    this.deck = createDeck(this.random);
    this.bankroll -= this.bet;
    this.player = [this.draw(), this.draw()];
    this.dealer = [this.draw(), this.draw()];
    this.phase = "playing";
    this.message = "Your turn. Hit, stand, or double down.";
    const playerScore = scoreHand(this.player);
    const dealerScore = scoreHand(this.dealer);
    if (playerScore.blackjack || dealerScore.blackjack) this.settleNaturals(playerScore, dealerScore);
    return true;
  }

  draw() { return this.deck.pop(); }

  canDouble() {
    return this.phase === "playing" && this.player.length === 2 && this.bankroll >= this.bet;
  }

  hit() {
    if (this.phase !== "playing") return false;
    this.player.push(this.draw());
    const score = scoreHand(this.player);
    if (score.bust) this.finish("lose", "Bust — dealer wins.");
    else if (score.total === 21) this.stand();
    else this.message = `You have ${score.total}. Choose hit or stand.`;
    return true;
  }

  double() {
    if (!this.canDouble()) return false;
    this.bankroll -= this.bet;
    this.bet *= 2;
    this.player.push(this.draw());
    const score = scoreHand(this.player);
    if (score.bust) this.finish("lose", "Double down bust — dealer wins.");
    else this.playDealer();
    return true;
  }

  stand() {
    if (this.phase !== "playing") return false;
    this.playDealer();
    return true;
  }

  playDealer() {
    this.phase = "dealer";
    while (scoreHand(this.dealer).total < 17) this.dealer.push(this.draw());
    const player = scoreHand(this.player);
    const dealer = scoreHand(this.dealer);
    if (dealer.bust) this.finish("win", "Dealer busts — you win!");
    else if (player.total > dealer.total) this.finish("win", `You win ${player.total} to ${dealer.total}!`);
    else if (player.total < dealer.total) this.finish("lose", `Dealer wins ${dealer.total} to ${player.total}.`);
    else this.finish("push", `Push at ${player.total}. Your wager is returned.`);
  }

  settleNaturals(player, dealer) {
    if (player.blackjack && dealer.blackjack) this.finish("push", "Both have blackjack — push.");
    else if (player.blackjack) this.finish("blackjack", "Blackjack! You win 3 to 2.");
    else this.finish("lose", "Dealer has blackjack.");
  }

  finish(outcome, message) {
    if (outcome === "win") this.bankroll += this.bet * 2;
    if (outcome === "blackjack") this.bankroll += this.bet * 2.5;
    if (outcome === "push") this.bankroll += this.bet;
    this.phase = "finished";
    this.message = message;
  }

  nextRound() {
    if (this.phase !== "finished") return false;
    this.player = [];
    this.dealer = [];
    this.bet = Math.min(this.bet, this.bankroll);
    this.phase = "betting";
    this.message = this.bankroll >= 5 ? "Choose a wager for the next hand." : "Session complete. Refresh to start a new practice bankroll.";
    return true;
  }
}

module.exports = { BlackjackGame, createDeck, scoreHand };
