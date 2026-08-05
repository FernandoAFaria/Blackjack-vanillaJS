const { BlackjackGame, scoreHand } = require("./model/dealer.model");

const game = new BlackjackGame();
const elements = {
  bankroll: document.querySelector("#bankroll"), bet: document.querySelector("#bet"), betInput: document.querySelector("#bet-input"),
  dealerCards: document.querySelector("#dealer-cards"), playerCards: document.querySelector("#player-cards"),
  dealerScore: document.querySelector("#dealer-score"), playerScore: document.querySelector("#player-score"),
  status: document.querySelector("#game-status"), deal: document.querySelector("#deal"), hit: document.querySelector("#hit"),
  stand: document.querySelector("#stand"), double: document.querySelector("#double"), next: document.querySelector("#next-round")
};
const symbols = { clubs: "♣", diamonds: "♦", hearts: "♥", spades: "♠" };

function money(value) { return `$${Number(value).toFixed(value % 1 ? 2 : 0)}`; }

function renderCards(cards, target, hideHole) {
  target.innerHTML = "";
  cards.forEach((card, index) => {
    const hidden = hideHole && index === 1;
    const item = document.createElement("li");
    item.className = `card ${hidden ? "card--back" : `card--${card.suit}`}`;
    item.setAttribute("aria-label", hidden ? "Dealer hole card, face down" : `${card.rank} of ${card.suit}`);
    item.innerHTML = hidden ? '<span aria-hidden="true">21</span>' : `<span class="card__rank">${card.rank}</span><span class="card__suit" aria-hidden="true">${symbols[card.suit]}</span>`;
    target.appendChild(item);
  });
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
  elements.status.textContent = game.message;
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
