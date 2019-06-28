import { Dealer } from "./model/dealer.model";
import { views } from "./views/cards";
import { createPublicKey } from "crypto";

(function(Dealer, Views) {
  //Control btns
  let stay_btn = document.querySelector(".stay_btn");
  let hit_btn = document.querySelector(".hit_btn");
  let reset_btn = document.querySelector(".reset_btn");
  let dealer_table = document.querySelector(".dealer");
  let player_table = document.querySelector(".player");

  let game_status = document.querySelector(".game_status");

  let game = new Dealer();

  initialDeal();

  

  //initially deals 4 cards;
  async function initialDeal() {
    

    if (52 - game.showDeltCards() < 4) {
      game_status.textContent = "Not Enough Cards, Refresh the browser";
      game_status.style.display = "block";
    } else {
             let card = await game.dealCard("dealer");

             Views.displayCard(card, "dealer");

             card = await game.dealCard("player");

             Views.displayCard(card, "player");

             card = await game.dealCard("dealer");

             Views.displayCard(card, "dealer");

             card = await game.dealCard("player");

             Views.displayCard(card, "player");

             //displays score
             Views.displayTotals(
               game.showDealerTotals(),
               game.showPlayerTotals()
             );
             document.querySelector(".in-deck").textContent =
               52 - game.showDeltCards();
             //Check for blackjack after dealing is done

             checkForBlackjack();
           }
  }
  //Check for blackjack during initial deal
  function checkForBlackjack() {
    hit_btn.disabled = "disabled";
    setTimeout(() => {
      if (game.showPlayerTotals() === 21) {
        game_status.textContent = "BlackJack! You Win";
        game_status.style.display = "block";
      }
      if (game.showDealerTotals() === 21) {
        game_status.textContent = "Dealer Has Blackjack!";
        game_status.style.display = "block";
      }
      hit_btn.disabled = "";
    }, 1500);
  }


  //Check score once player takes a hit;
  function checkScore() {
    hit_btn.disabled = "disabled";
    document.querySelector(".in-deck").textContent =
      52 - game.showDeltCards();
    setTimeout(() => {
       
      if (game.showPlayerTotals() > 21) {
        game_status.textContent = "You BUST!";
        game_status.style.display = "block";
      }
      hit_btn.disabled = "";
    }, 1500);
  }

  //Reset Game

  function resetGame() {
    game.reset();
    Views.reset();
    

      try {
        document.querySelector('.dealer-score').style.display = 'none';
        hit_btn.disabled = "";
      } catch(err){
        console.log(err)
      }
      
      game_status.style.display = "none";
      //Animation for clearing table
      let allCards = document.getElementsByClassName("flip-card");
      for (let i = 0; i < allCards.length; i++) {
        setTimeout(() => {
          allCards[i].style.transform = "translate(-110vw, 75px)";
        }, 200 * i);
      }
      
      //clear the HTML
      setTimeout(() => {
        Views.displayTotals(game.showDealerTotals(), game.showPlayerTotals());
        dealer_table.innerHTML = "";
        player_table.innerHTML = "";
      }, 1200);
      
      //deal cards
      
      setTimeout(() => {
        initialDeal();
        checkScore();
      }, 1500);
    
  }
    
    function dealerHit(){
      let dealerTotal = game.showDealerTotals();
      let playerTotal = game.showPlayerTotals();
      
      if (dealerTotal <= 15) {
        
        setTimeout(async () => {
          let card = await game.dealCard("dealer");
          Views.displayCard(card, "dealer");
          dealerTotal = game.showDealerTotals();
          Views.displayTotals(
            game.showDealerTotals(),
            game.showPlayerTotals()
          );
          setTimeout(() => {
            dealerHit();
          },1000)
           
      },1000)
    }
    if(dealerTotal > 21){
      game_status.textContent = "Dealer Busts!";
      game_status.style.display = "block";
    }

    if(dealerTotal > 15 && dealerTotal < 22) {

      if(dealerTotal > playerTotal){
        //Dealer Wins
        game_status.textContent = "Dealer Wins!";
        game_status.style.display = "block";
      } 

      //Tied Game
      if(dealerTotal === playerTotal) {
        game_status.textContent = "Push!";
        game_status.style.display = "block";
      }
   

      if(dealerTotal < playerTotal && playerTotal < 22) {
        game_status.textContent = "Player Wins!";
        game_status.style.display = "block";
      }

      
     }
      
  }

  //event listeners

  //Hit Btn
  hit_btn &&
  hit_btn.addEventListener("click", async () => {
    
    let player_card = await game.dealCard("player");
    
    views.displayCard(player_card, "player");

    Views.displayTotals(game.showDealerTotals(), game.showPlayerTotals());

    checkScore();
  });

  //Stay Btn
  stay_btn &&
  stay_btn.addEventListener('click', () => {
    hit_btn.disabled = 'disabled';
    
    document.querySelector('.hidden').classList.remove('hidden');
    document.querySelector('.dealer-score').style.display = 'inline';
    dealerHit();
  })

  //Reset Game
  reset_btn &&
  reset_btn.addEventListener("click", resetGame);
  
})(Dealer, views);
