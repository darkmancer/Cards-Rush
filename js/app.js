"use strict";

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


var cards = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o",
    "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt",
    "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
    "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"
];




const deck = document.querySelector('.deck');

function startGame() {
    let htmlCardSet = shuffle(cards).map(function(card) {
        return `<li class="card"><i class="fa ${card}"></i></li>`;
    });
    deck.innerHTML = htmlCardSet.join('');
}
//shuffling card and return to Html to ready the card
startGame();

let cardMatches = 0;
let cardOpened = null;
//add event Listener to open the card when clicked including checking function of the card that matches or not at the same time 
function activatedCards() {
    var cardsAll = document.querySelectorAll('.card');
    console.log(cardsAll);

    cardsAll.forEach(function(card) {
        card.addEventListener('click', function() {
            turnOnGame();
            // defensive condition to secure that all card can be opened when clicked
            if (!card.classList.contains('open') && !card.classList.contains('match')) {
                card.classList.add('open', 'show');
                card.classList.add('stop-clickable'); // prevent card to match itself 
            }
            // the condition for the second click only
            if (cardOpened) {
                cardsAll.forEach(function(card) {
                    // when 2 cards opened freeze the other cards for a while until the animation and the checking finish
                    card.classList.add('stop-clickable');
                });
                // if cards match, both remain opened 
                if (cardOpened.querySelector('i').classList.item(1) == card.querySelector('i').classList.item(1)) {
                    setTimeout(function() {
                        card.classList.remove('open', 'show');
                        card.classList.add('match', 'stop-clickable');
                        cardOpened.classList.remove('open', 'show');
                        cardOpened.classList.add('match', 'stop-clickable');
                        // clear the variable 
                        cardOpened = null;
                        // count the move
                        moveCount();
                        // check if the number of move exceed the level if exceed 1star lost
                        lostStar();
                        // the number of pairs of card match
                        cardMatches++;
                        // check if all card matches activate the modal to see the result

                        checkEndGame();
                        //delay    
                    }, 500);
                    // if cards not match, close both cards
                } else {
                    setTimeout(function() {
                        card.classList.remove('open', 'show');
                        cardOpened.classList.remove('open', 'show');
                        // release the first clicked card from unclickable state
                        cardOpened.classList.remove('stop-clickable');
                        cardOpened = null;
                        moveCount();
                        lostStar();
                        // delay to let the card animate
                    }, 500);
                }
                // release the other cards from freezing so the game can be continued  
                setTimeout(function() {
                    cardsAll.forEach(function(card) {
                        card.classList.remove('stop-clickable');
                    });
                }, 500);
                // the is no card open yet then let's open the card!!    
            } else {
                //stored the first card 
                cardOpened = card;
            }



        });
    });
}
// active this so all the cards can be clickable
activatedCards();

const refreshButton = document.querySelector('.restart');
refreshButton.addEventListener('click', resetGame);
console.log(refreshButton);
//reset the game
function resetGame() {

    startGame();
    activatedCards();
    resetLifes();
    resetStars();
    resetClock();
    resetCardMatches();
    closeModal();

}

// starter rating   
let rating = 3;
let starLife = document.querySelector('.fa-star');

function lostStar() {
    // more than 13 move lost one star
    if (moveMade == 14) {
        starLife.classList.remove('fa-star');
        // white star indicate lost 
        starLife.innerHTML = `<li><i>&#9734;</i></li>`;
        rating--;
        // catch the next star to be lost if the move exceed
        starLife = document.querySelector('.fa-star');
    }
    // more than 17 move lost another star
    if (moveMade == 17) {
        starLife.classList.remove('fa-star');
        starLife.innerHTML = `<li><i>&#9734;</i></li>`;
        rating--;
        starLife = document.querySelector('.fa-star');
    }
    // more than 19 move get no star :P
    if (moveMade == 20) {
        starLife.classList.remove('fa-star');
        starLife.innerHTML = `<li><i>&#9734;</i></li>`;
        rating--;
    }
}



let move = document.querySelector('.moves');
let moveMade = 0;
let wordMove = document.querySelector('.the-moves');
// tracking the number of move
function moveCount() {
    moveMade += 1;

    move.innerText = moveMade;
    if (moveMade > 1) {

        wordMove.innerText = 'Moves';
    }

}

// reset number of move 
function resetLifes() {
    moveMade = 0;
    move.innerText = moveMade;
    wordMove.innerText = 'Move';
}
// reset stars
function resetStars() {
    var theStars = document.querySelector('.stars');
    theStars.innerHTML = `<li><i class="fa fa-star"></i></li>
                      <li><i class="fa fa-star"></i></li>
                      <li><i class="fa fa-star"></i></li>`;
    starLife = document.querySelector('.fa-star');
}

let gameIsStarted = false;
let ticking = null;
// turn on the stop watch
function turnOnGame() {
    if (!gameIsStarted) {
        gameIsStarted = true;
        ticking = setInterval(timeStart, 17.5);
    }
}




let centiSec = 0;
let sec = 0;
let secSaved = 0;
let centiSecHtml = document.querySelector('#centi-second');
let secHtml = document.querySelector('#second');
//displaying the time every centisecond
function timeStart() {
    secSaved = ++centiSec;
    sec = secSaved / 60;
    secHtml.innerText = parseInt(sec);
    secSaved = secSaved % 60;
    centiSecHtml.innerText = secSaved;
}
// reset the stop watch
function resetClock() {
    centiSec = 0;
    sec = 0;
    secSaved = 0;
    gameIsStarted = false;
    clearInterval(ticking);
    ticking = null;
    secHtml.innerText = 0;
    centiSecHtml.innerText = "00";
}

function resetCardMatches() {
    cardMatches = 0;
    //reset the opened card that saved in variable 
    cardOpened = null;
}
// check if card matches are 8 already
function checkEndGame() {
    if (cardMatches == 8) {
        console.log("gameEnd");
        // stop the clock
        clearInterval(ticking);
        // open end game modal
        openModal();
    }
}

// modal and result
const modal = document.querySelector('#simpleModal');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const modalReplayBtn = document.querySelector('.modal-replay-btn');
const modalMoves = document.querySelector('.modal-body .moves-count');
const modalSeconds = document.querySelector('.modal-body .seconds');
const modalCentiSeconds = document.querySelector('.modal-body .centi-secs');
const modalRating = document.querySelector('.modal-body .rating');
modalCloseBtn.addEventListener('click', closeModal);
modalReplayBtn.addEventListener('click', resetGame);

function openModal() {

    modalSeconds.textContent = `${parseInt(sec)}`;
    modalCentiSeconds.textContent = `${parseInt(secSaved).toString().charAt(0)+parseInt(secSaved).toString().charAt(1)} seconds`;
    modalMoves.textContent = `${moveMade} moves`;
    modalRating.textContent = `${rating}`;
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}
// ready up every thing to be played
resetGame();