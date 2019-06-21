import {Dealer} from './model/dealer.model';
import {views} from './views/cards';



(function(Dealer, Views){
  //Control btns
  let stay_btn = document.querySelector('.stay_btn');
  let hit_btn = document.querySelector('.hit_btn');
  let reset_btn = document.querySelector('.reset_btn');
  let game = new Dealer();


  //initially deals 4 cards;

  Views.displayCard(game.dealCard("player"), "player");
  Views.displayCard(game.dealCard("dealer"), "dealer");

  Views.displayCard(game.dealCard("player"), "player");
  Views.displayCard(game.dealCard("dealer"), "dealer");

  //displays score

  Views.displayTotals(game.showDealerTotals(), game.showPlayerTotals())

  //event listeners

  hit_btn.addEventListener('click', () => {
    Views.displayCard(game.dealCard("player"), "player");
    Views.displayTotals(game.showDealerTotals(), game.showPlayerTotals());
  })
 
})(Dealer, views)