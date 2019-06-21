function randomNumber() {
  return Math.floor(Math.random() * 52);
}
//Create an array with all cards
//e.g. array[0]should be equal to "ClubsAce"

let cardMap = [
  "ClubsAce",
  "Clubs2",
  "Clubs3",
  "Clubs4",
  "Clubs5",
  "Clubs6",
  "Clubs7",
  "Clubs8",
  "Clubs9",
  "Clubs10",
  "ClubsJack",
  "ClubsQueen",
  "ClubsKing",
  "DiamondsAce",
  "Diamonds2",
  "Diamonds3",
  "Diamonds4",
  "Diamonds5",
  "Diamonds6",
  "Diamonds7",
  "Diamonds8",
  "Diamonds9",
  "Diamonds10",
  "DiamondsJack",
  "DiamondsQueen",
  "DiamondsKing",
  "HeartsAce",
  "Hearts2",
  "Hearts3",
  "Hearts4",
  "Hearts5",
  "Hearts6",
  "Hearts7",
  "Hearts8",
  "Hearts9",
  "Hearts10",
  "HeartsJack",
  "HeartsQueen",
  "HeartsKing",
  "SpadesAce",
  "Spades2",
  "Spades3",
  "Spades4",
  "Spades5",
  "Spades6",
  "Spades7",
  "Spades8",
  "Spades9",
  "Spades10",
  "SpadesJack",
  "SpadesQueen",
  "SpadesKing"
];

//Card value holds suit, card, and value of each card

let cardValues = {
  ClubsAce: { suit: "Clubs", value: 11, card: "Ace" },
  Clubs2: { suit: "Clubs", value: 2, card: "2" },
  Clubs3: { suit: "Clubs", value: 3, card: "3" },
  Clubs4: { suit: "Clubs", value: 4, card: "4" },
  Clubs5: { suit: "Clubs", value: 5, card: "5" },
  Clubs6: { suit: "Clubs", value: 6, card: "6" },
  Clubs7: { suit: "Clubs", value: 7, card: "7" },
  Clubs8: { suit: "Clubs", value: 8, card: "8" },
  Clubs9: { suit: "Clubs", value: 9, card: "9" },
  Clubs10: { suit: "Clubs", value: 10, card: "10" },
  ClubsJack: { suit: "Clubs", value: 10, card: "Jack" },
  ClubsQueen: { suit: "Clubs", value: 10, card: "Queen" },
  ClubsKing: { suit: "Clubs", value: 10, card: "King" },
  //Diamonds
  DiamondsAce: { suit: "Diamonds", value: 11, card: "Ace" },
  Diamonds2: { suit: "Diamonds", value: 2, card: "2" },
  Diamonds3: { suit: "Diamonds", value: 3, card: "3" },
  Diamonds4: { suit: "Diamonds", value: 4, card: "4" },
  Diamonds5: { suit: "Diamonds", value: 5, card: "5" },
  Diamonds6: { suit: "Diamonds", value: 6, card: "6" },
  Diamonds7: { suit: "Diamonds", value: 7, card: "7" },
  Diamonds8: { suit: "Diamonds", value: 8, card: "8" },
  Diamonds9: { suit: "Diamonds", value: 9, card: "9" },
  Diamonds10: { suit: "Diamonds", value: 10, card: "10" },
  DiamondsJack: { suit: "Diamonds", value: 10, card: "Jack" },
  DiamondsQueen: { suit: "Diamonds", value: 10, card: "Queen" },
  DiamondsKing: { suit: "Diamonds", value: 10, card: "King" },
  //Hearts
  HeartsAce: { suit: "Hearts", value: 11, card: "Ace" },
  Hearts2: { suit: "Hearts", value: 2, card: "2" },
  Hearts3: { suit: "Hearts", value: 3, card: "3" },
  Hearts4: { suit: "Hearts", value: 4, card: "4" },
  Hearts5: { suit: "Hearts", value: 5, card: "5" },
  Hearts6: { suit: "Hearts", value: 6, card: "6" },
  Hearts7: { suit: "Hearts", value: 7, card: "7" },
  Hearts8: { suit: "Hearts", value: 8, card: "8" },
  Hearts9: { suit: "Hearts", value: 9, card: "9" },
  Hearts10: { suit: "Hearts", value: 10, card: "10" },
  HeartsJack: { suit: "Hearts", value: 10, card: "Jack" },
  HeartsQueen: { suit: "Hearts", value: 10, card: "Queen" },
  HeartsKing: { suit: "Hearts", value: 10, card: "King" },
  //Spades
  SpadesAce: { suit: "Spades", value: 11, card: "Ace" },
  Spades2: { suit: "Spades", value: 2, card: "2" },
  Spades3: { suit: "Spades", value: 3, card: "3" },
  Spades4: { suit: "Spades", value: 4, card: "4" },
  Spades5: { suit: "Spades", value: 5, card: "5" },
  Spades6: { suit: "Spades", value: 6, card: "6" },
  Spades7: { suit: "Spades", value: 7, card: "7" },
  Spades8: { suit: "Spades", value: 8, card: "8" },
  Spades9: { suit: "Spades", value: 9, card: "9" },
  Spades10: { suit: "Spades", value: 10, card: "10" },
  SpadesJack: { suit: "Spades", value: 10, card: "Jack" },
  SpadesQueen: { suit: "Spades", value: 10, card: "Queen" },
  SpadesKing: { suit: "Spades", value: 10, card: "King" }
};
//Once a card is delt, it should be checked against deltCards,  If not found, it's good to go, otherwise select another card.

export class Dealer {
         constructor() {
           this.deltCards = {};
           this.dealerCards = [];
           this.playerCards = [];
           this.dealerTotal = 0;
           //Incase an Ace is delt
           this.dealerAlternateTotal = 0;

           this.userTotal = 0;
           //Incase an Ace is delt
           this.userAlternateTotal = 0;
         }

         showDeltCards() {
           let keys = Object.keys(this.deltCards);
           return keys.length;
         }

         clearAllCards() {
           this.deltCards = {};
           this.dealerCards = [];
           this.playerCards = [];
           this.dealerTotal = 0;
           //Incase an Ace is delt
           this.dealerAlternateTotal = 0;

           this.userTotal = 0;
           //Incase an Ace is delt
           this.userAlternateTotal = 0;
         }
         showPlayerTotals() {
           let playerTotal = 0;
           let playerAlternate = 0;

           for (let i = 0; i < this.playerCards.length; i++) {
             if (this.playerCards[i].value != 11) {
               playerTotal += this.playerCards[i].value;
               playerAlternate += this.playerCards[i].value;
             } else {
               playerTotal += 1;
               playerAlternate += 11;
             }
           }
             if (
               playerAlternate > playerTotal &&
               playerAlternate < 22
             ) {
               return playerAlternate;
             } else {
               return playerTotal;
             }
         }

         showDealerTotals() {
           let dealerTotal = 0;
           let dealerAlternate = 0;

           for (let i = 0; i < this.dealerCards.length; i++) {
             if (this.dealerCards[i].value != 11) {
               dealerTotal += this.dealerCards[i].value;
               dealerAlternate += this.dealerCards[i].value;
             } else {
               dealerTotal += 1;
               dealerAlternate += 11;
             }
           }
           if(dealerAlternate > dealerTotal && dealerAlternate < 22){
             return dealerAlternate
           }
           else{
            return dealerTotal
           }
           
         }

         dealCard(who) {
           if (who === "dealer") {
             let randomCard = cardMap[randomNumber()];

             if (this.deltCards.hasOwnProperty(randomCard)) {
               this.dealCard("dealer");
             } else {
               let myCard = cardValues[randomCard.toString()];
               this.dealerCards.push(myCard);
               this.deltCards[randomCard.toString()] = 1;

              
               return myCard;
             }
           }

           if (who === "player") {
             let randomCard = cardMap[randomNumber()];
             if (this.deltCards.hasOwnProperty(randomCard)) {
               this.dealCard("player");
             } else {
               let myCard = cardValues[randomCard.toString()];

               this.playerCards.push(myCard);
               this.deltCards[randomCard.toString()] = 1;
              
               return myCard;
             }
           }
         }
       }
