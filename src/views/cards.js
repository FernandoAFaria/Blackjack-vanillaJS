export const views = {
  playerTable: document.querySelector(".player"),
  dealerTable: document.querySelector(".dealer"),
  playerScore: document.querySelector(".player-score"),
  dealerScore: document.querySelector(".dealer-score"),
  cardCount: 0,
  dealerCardCount: 0,

  reset: function() {
    this.cardCount = 0;
    this.dealerCardCount = 0;
  },

  displayCard: function(card, player) {
    
    let myCard = "";
    this.cardCount++;
    let markup = "";
    let suit = card.suit.toLowerCase();
    let div = document.createElement("div");
    div.classList.add("flip-card");

    //This will slice the KING to just K to display on the card
    if (card.card.length > 2) {
      myCard = card.card.toString().slice(0, 1);
    } else {
      myCard = card.card.toString();
    }

    //the Second dealer card needs to be hidden
    if (player === "dealer") {
      this.dealerCardCount++;
    }
    if (this.dealerCardCount === 2 && player === "dealer") {
      markup = `
    <div class="flip-card-inner hidden ">
      <div class="flip-card-front">
  
      </div>
      <div class="flip-card-back ">
        <div class="top-left">${myCard}</div>
        <div class="top-right">${myCard}</div>
        <div class="bottom-left">${myCard}</div>
        <div class="bottom-right">${myCard}</div>
        <div class="center"><img class='suit' src="./assets/imgs/${suit}.png" /></div>
      </div>
    </div>
  `;
    } else {
      markup = `
    <div class="flip-card-inner  ">
      <div class="flip-card-front">
  
      </div>
      <div class="flip-card-back">
        <div class="top-left">${myCard}</div>
        <div class="top-right">${myCard}</div>
        <div class="bottom-left">${myCard}</div>
        <div class="bottom-right">${myCard}</div>
        <div class="center"><img class='suit' src="./assets/imgs/${suit}.png" /></div>
      </div>
    </div>
  `;
    }

    if (player === "player") {
      div.innerHTML = markup;
      this.playerTable.insertAdjacentElement("beforeend", div);
      // this.playerTable.insertAdjacentHTML('beforeend', markup)
      setTimeout(() => {
        div.style.transform = "translate(0)";
      }, 200 * this.cardCount);
    } else {
      div.innerHTML = markup;
      this.dealerTable.insertAdjacentElement("beforeend", div);
      setTimeout(() => {
        div.style.transform = "translate(0)";
      }, 200 * this.cardCount);
    }
  },

  displayTotals: function(dealerScore, playerScore) {
    this.playerScore.textContent = playerScore;
    this.dealerScore.textContent = dealerScore;
    
  }
};
