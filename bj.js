var dealerSum = 0;
var yourSum = 0;

var win_sound = new Audio('win.wav');
var lose_sound = new Audio('lose.wav');
var tie_sound = new Audio('tie.wav');

var dealerAceCount = 0;
var yourAceCount = 0;
var wager = 0;
var balence = 100;
var message = "";
var insurance_value = 0;

var hidden;
var deck;
var dealt_cards = [];

var canHit = true;
var deals = true;
var double = false;
var insurance = false;

window.onload = function () {
    buildDeck();
    Suffledeck();
    Startgame();
}
function bet() {
    if (balence == 0) {
        return;
    }
    if (deals == false) {
        return;
    }
    wager += 10;
    balence -= 10;
    document.getElementById("value").innerText = wager;
    document.getElementById("balence").innerText = balence;
    console.log(wager);
}
function buildDeck() {
    values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "ace", "jack", "king", "queen"];
    types = ["c", "s", "d", "h"];
    deck = [];
    for (let k = 0; k < 1; k++) {
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < types.length; j++) {
                deck.push(values[i] + " - " + types[j]);
            }
        }
    }
    console.log(deck);
}
function Suffledeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}
function Startgame() {
    document.getElementById("value").innerText = wager;
    document.getElementById("insurance_msg").innerText = insurance_value;
    document.getElementById("balence").innerText = balence;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    document.getElementById("wager").addEventListener("click", bet);
    document.getElementById("deal").addEventListener("click", deal_cards);
    hidden = deck.pop();
    dealt_cards.push(hidden);
    dealerSum += getValues(hidden);
    dealerAceCount += checkAce(hidden);
    double = true;
    document.getElementById("double").addEventListener("click", times_2);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function getValues(card) {
    let data = card.split(" - ")
    let value = data[0];

    if (isNaN(value)) {
        if (value == "ace") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    let data = card.split(" - ");
    if (data[0] == "ace") {
        return 1;
    }
    return 0;
}
function hit() {
    if(deals == true){return;}
    insurance = false;
    double = false;
    deals = false;
    if (!canHit) {
        return;
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealt_cards.push(card);
    yourSum += getValues(card);
    yourAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);
    if (yourSum > 21) {
        let pair = reduceAce(yourSum, yourAceCount);
        yourSum = pair[0];
        yourAceCount = pair[1];
        console.log(yourAceCount);
    }
    if (yourSum > 21) {
        canHit = false;
    }
    document.getElementById("player-sum").innerText = yourSum;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return [playerSum, playerAceCount];
}
function stay() {
    if(deals == true){return;}
    insurance = false;
    double = false;
    deals = false;
    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
    while (dealerSum < 21 && dealerSum < yourSum && yourSum < 21) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealt_cards.push(card);
        dealerSum += getValues(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").appendChild(cardImg);
        let dealer_pair = reduceAce(dealerSum, dealerAceCount);
        dealerSum = dealer_pair[0];
        dealerAceCount = dealer_pair[1];
    }
    let dealer_pair = reduceAce(dealerSum, dealerAceCount);
    dealerSum = dealer_pair[0];
    dealerAceCount = dealer_pair[1];
    let your_pair = reduceAce(yourSum, yourAceCount);
    yourSum = your_pair[0];
    yourAceCount = your_pair[1];
    if (dealerSum > 21) {
        balence += wager;
        balence += wager;
        message = "BUST YOU WIN";
        win_sound.play();
    }
    else if (yourSum > 21) {
        message = "BUST YOU LOSE !";
        balence += insurance_value * 2;
        lose_sound.play();
    }
    else if (yourSum == dealerSum) {
        balence += wager;
        message = "PUSH !";
        tie_sound.play();
    }
    else if (yourSum > dealerSum) {
        balence += wager;
        balence += wager;
        message = "YOU WIN!";
        win_sound.play();
    }
    else if (yourSum < dealerSum) {
        message = "YOU LOSE";
        balence += insurance_value * 2;
        lose_sound.play();
    }
    console.log(dealt_cards);
    document.getElementById("insurance_msg").innerText = insurance_value;
    document.getElementById("value").innerText = wager;
    document.getElementById("balence").innerText = balence;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
    setTimeout(function () {
        Resumegame();
    }, 1000 * 5);
}
function deal_cards() {
    if (deals == false) {
        return;
    }
    deals = false;
    document.getElementById("change").innerHTML = "";
    message = "";
    document.getElementById("results").innerText = message;
    let cardImg = document.createElement("img");
    let card = deck.pop();
    if (card == "ace - c" || card == "ace - d" || card == "ace - h" || card == "ace - s") {
        insurance = true;
        document.getElementById("insurance").addEventListener("click", insurance_fn);
    }
    cardImg.src = "./cards/" + card + ".png";
    dealt_cards.push(card);
    dealerSum += getValues(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").appendChild(cardImg);
    console.log(dealerSum);
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealt_cards.push(card);
        yourSum += getValues(card);
        yourAceCount += checkAce(card);
        document.getElementById("player-cards").append(cardImg);
    }
    console.log(dealt_cards);
    document.getElementById("player-sum").innerText = yourSum;
    if (yourSum == 21) {
        canHit = false;
        message = "Blackjack - you win!";
        win_sound.play();
        balence += 1.5 * wager;
        document.getElementById("insurance_msg").innerText = insurance_value;
        document.getElementById("value").innerText = wager;
        document.getElementById("balence").innerText = balence;
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("player-sum").innerText = yourSum;
        document.getElementById("results").innerText = message;
        setTimeout(function () {
            Resumegame();
        }, 1000 * 5);
    }
}
function insurance_fn() {
    if (insurance == false) {
        return;
    }
    if (insurance_value < wager / 2) {
        balence -= 10;
        insurance_value += 10;
        document.getElementById("insurance_msg").innerText = insurance_value;
        document.getElementById("balence").innerText = balence;
    }
}
function times_2() {
    if(deals == true){return;}
    insurance = false;
    if (double == false) {
        return;
    }
    double = false;
    if (balence < wager) {
        return;
    }
    balence -= wager;
    wager += wager;
    hit();
    stay();
}
function Resumegame() {
    deals = true;
    insurance = false;
    document.getElementById("change").innerHTML = "Blackjack pays 3 to 2 and insurance pays 2 to 1.";
    document.getElementById("dealer-cards").innerHTML = "<img id = 'hidden' src = './cards/face - down.png'>";
    document.getElementById("player-cards").innerHTML = "";
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    wager = 0;
    message = "";
    insurance_value = 0;
    canHit = true;
    if (balence != 0) {
        Startgame();
    }
    else {
        gameOver();
    }
}
function deal() {
    hidden = deck.pop();
    dealerSum += getValues(hidden);
    dealerAceCount += checkAce(hidden);
    deal_cards();
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}
function gameOver() {
    document.getElementById("value").innerText = wager;
    document.getElementById("balence").innerText = balence;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("player-sum").innerText = yourSum;
    deals = false;
    canHit = false;
    document.getElementById("results").innerText = "Game Over! Your balance is empty.";
    // Disable buttons
    document.getElementById("wager").disabled = true;
    document.getElementById("deal").disabled = true;
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;
    document.getElementById("double").disabled = true;
    document.getElementById("insurance").disabled = true;
}