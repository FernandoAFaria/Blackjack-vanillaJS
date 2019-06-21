import {Dealer} from './model/dealer.model';



(function(Dealer){



  let game = new Dealer();

  game.dealCard('player');
  game.dealCard('dealer');
  game.dealCard("player");
  game.dealCard("dealer");

 console.log(game.showDealerTotals());
 console.log(game.showPlayerTotals());


 
})(Dealer)