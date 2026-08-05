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
