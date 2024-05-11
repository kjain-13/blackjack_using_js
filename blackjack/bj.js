var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0;
var wager = 0;
var balence = 100;
var deal = true;

var hidden;
var deck;

var canHit = true;

window.onload = function(){
    buildDeck();
    Suffledeck();
    Startgame();
}
function bet(){
    if(deal == false){
        return;
    }
    wager += 10;
    balence -= 10;
    if(balence == 0){
        deal = false;
    }
    document.getElementById("value").innerText = wager;
    document.getElementById("balence").innerText = balence;
    console.log(wager);
}
function buildDeck(){
    values = ["2" , "3" , "4" , "5" , "6" , "7" , "8" , "9" , "10" , "ace" , "jack" , "king" , "queen"];
    types = ["c" , "s" , "d" , "h"];
    deck = [];
    for(let k = 0 ; k < 1 ; k++){
        for(let i = 0; i < values.length ; i++){
            for(let j = 0 ; j < types.length ; j++){
                deck.push(values[i] + " - " + types[j]);
            }
        }
    }
    console.log(deck);
}
function Suffledeck(){
    for(let i = 0; i < deck.length ; i++){
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}
function Startgame(){
    document.getElementById("balence").innerText = balence;
    document.getElementById("wager").addEventListener("click",bet);
    hidden = deck.pop();
    dealerSum += getValues(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerAceCount);
    // console.log(dealerSum);
    for(let i = 0 ; i < 1; i++){
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValues(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);
    for(let i = 0 ; i < 2; i++){
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValues(card);
        yourAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardImg);
    }
    console.log(yourSum);
    document.getElementById("player-sum").innerText = yourSum;
    if(yourSum == 21){
        canHit = false;
        message = "Blackjack - you win!";
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("player-sum").innerText = yourSum;
        document.getElementById("results").innerText = message;
    }
    document.getElementById("hit").addEventListener("click",hit);
    document.getElementById("stay").addEventListener("click",stay);
   
}

function getValues(card){
    let data = card.split(" - ")
    let value = data[0];

    if(isNaN(value)){
        if(value == "ace"){
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card){
    let data = card.split(" - ");
    if(data[0] == "ace"){
        return 1;
    }
    return 0;
}
function hit(){
    deal = false;
    if(!canHit){
        return;
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValues(card);
    yourAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);
    if(yourSum > 21){
        let pair = reduceAce(yourSum,yourAceCount);
        yourSum = pair[0];
        yourAceCount = pair[1];
        console.log(yourAceCount);
    }
    if(yourSum > 21){
        canHit = false;
    }
    document.getElementById("player-sum").innerText = yourSum;
}

function reduceAce(playerSum , playerAceCount){
    while(playerSum > 21 && playerAceCount > 0){
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return [playerSum,playerAceCount];
}
function stay(){
    deal = false;
    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
    while(dealerSum < 21 && dealerSum < yourSum && yourSum < 21){
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValues(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        let dealer_pair = reduceAce(dealerSum,dealerAceCount);
        dealerSum = dealer_pair[0];
    }
    let dealer_pair = reduceAce(dealerSum,dealerAceCount);
    dealerSum = dealer_pair[0];
    let your_pair = reduceAce(yourSum,yourAceCount);
    yourSum = your_pair[0];
    let message = "";
    if(dealerSum > 21){
        balence += wager;
        balence += wager;
        message = "BUST YOU WIN";
    }
    else if(yourSum > 21){
        message = "BUST YOU LOSE !";
    }
    else if(yourSum == dealerSum){
        balence += wager;
        message = "PUSH !";
    }
    else if(yourSum > dealerSum){
        balence += wager;
        balence += wager;
        message = "YOU WIN!";
    }
    else if(yourSum < dealerSum){
        message = "YOU LOSE";
    }
    document.getElementById("value").innerText = wager;
    document.getElementById("balence").innerText = balence;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}