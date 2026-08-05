"use strict";
(function () {
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





const game = new BlackjackGame();
const elements = {
  bankroll: document.querySelector("#bankroll"), bet: document.querySelector("#bet"), betInput: document.querySelector("#bet-input"),
  dealerCards: document.querySelector("#dealer-cards"), playerCards: document.querySelector("#player-cards"),
  dealerScore: document.querySelector("#dealer-score"), playerScore: document.querySelector("#player-score"),
  status: document.querySelector("#game-status"), deal: document.querySelector("#deal"), hit: document.querySelector("#hit"),
  stand: document.querySelector("#stand"), double: document.querySelector("#double"), next: document.querySelector("#next-round")
};
const symbols = { clubs: "♣", diamonds: "♦", hearts: "♥", spades: "♠" };
let lastMessage = "";

function money(value) { return `$${Number(value).toFixed(value % 1 ? 2 : 0)}`; }

function setCardFace(item, card, hidden) {
  item.className = `card ${hidden ? "card--back" : `card--${card.suit}`}`;
  item.setAttribute("aria-label", hidden ? "Dealer hole card, face down" : `${card.rank} of ${card.suit}`);
  item.innerHTML = hidden ? '<span aria-hidden="true">21</span>' : `<span class="card__rank">${card.rank}</span><span class="card__suit" aria-hidden="true">${symbols[card.suit]}</span>`;
}

function renderCards(cards, target, hideHole) {
  while (target.children.length > cards.length) target.lastElementChild.remove();
  cards.forEach((card, index) => {
    const hidden = hideHole && index === 1;
    const identity = `${card.rank}-${card.suit}`;
    let item = target.children[index];
    if (!item || item.dataset.card !== identity) {
      item = document.createElement("li");
      item.dataset.card = identity;
      item.style.setProperty("--deal-index", index);
      setCardFace(item, card, hidden);
      item.classList.add("card--dealt");
      if (target.children[index]) target.replaceChild(item, target.children[index]);
      else target.appendChild(item);
      return;
    }
    if (item.classList.contains("card--back") && !hidden) {
      setCardFace(item, card, false);
      item.classList.add("card--revealing");
    }
  });
}

function renderStatus() {
  if (lastMessage === game.message) return;
  lastMessage = game.message;
  elements.status.textContent = game.message;
  elements.status.dataset.phase = game.phase;
  elements.status.classList.remove("status--changed");
  void elements.status.offsetWidth;
  elements.status.classList.add("status--changed");
}

function render() {
  const playing = game.phase === "playing";
  const betting = game.phase === "betting";
  const finished = game.phase === "finished";
  const hideHole = playing;
  elements.bankroll.textContent = money(game.bankroll);
  elements.bet.textContent = money(game.bet);
  elements.betInput.max = game.bankroll;
  elements.betInput.disabled = !betting || game.bankroll < 5;
  elements.deal.disabled = !betting || game.bet < 5 || game.bet > game.bankroll;
  elements.hit.disabled = !playing;
  elements.stand.disabled = !playing;
  elements.double.disabled = !game.canDouble();
  elements.next.hidden = !finished;
  renderStatus();
  renderCards(game.dealer, elements.dealerCards, hideHole);
  renderCards(game.player, elements.playerCards, false);
  elements.playerScore.textContent = game.player.length ? scoreHand(game.player).total : "—";
  elements.dealerScore.textContent = game.dealer.length ? (hideHole ? scoreHand([game.dealer[0]]).total : scoreHand(game.dealer).total) : "—";
}

elements.betInput.addEventListener("input", event => { game.setBet(Number(event.target.value)); render(); });
elements.deal.addEventListener("click", () => { game.setBet(Number(elements.betInput.value)); game.deal(); render(); });
elements.hit.addEventListener("click", () => { game.hit(); render(); });
elements.stand.addEventListener("click", () => { game.stand(); render(); });
elements.double.addEventListener("click", () => { game.double(); render(); });
elements.next.addEventListener("click", () => { game.nextRound(); elements.betInput.value = game.bet || 25; game.setBet(Number(elements.betInput.value)); render(); elements.deal.focus(); });
document.addEventListener("keydown", event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target === elements.betInput) return;
  const action = { h: elements.hit, s: elements.stand, d: elements.double, n: elements.next }[event.key.toLowerCase()];
  if (action && !action.disabled && !action.hidden) { event.preventDefault(); action.click(); }
});

game.setBet(Number(elements.betInput.value));
render();

})();
