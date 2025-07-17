
let selectedCardIndex = null;
let isPlayerTurn = true;
let gameOver = false;
let calledUNO = false;
let passBtn = document.getElementById("pass-btn");

let musicSetting = localStorage.getItem("music");
let soundSetting = localStorage.getItem("sound");

let bgm = document.getElementById("bgm");
let cardsound = document.getElementById("cardsound");

if (musicSetting === "music-off") {
  bgm.pause();
} else {
  bgm.play();
}

function playCardSound() {
  if (soundSetting === "game-sound-off") return;
  cardsound.pause();
  cardsound.currentTime = 0.5;
  cardsound.playbackRate = 2;
  cardsound.play();
}




function createFullDeck(){
  let orgDeck = [];
  orgDeck.push(
    {color: "wild", value: "+4"},
    {color: "wild", value: "+4"},
    {color: "wild", value: "wild"},
    {color: "wild", value: "wild"},
    {color: "red", value: 0},
    {color: "blue", value: 0},
    {color: "green", value: 0},
    {color: "yellow", value: 0}
  );
  
  for (let i = 1; i < 10; i++){
    orgDeck.push(
    {color: "red", value: i},
    {color: "red", value: i},
    {color: "blue", value: i},
    {color: "blue", value: i},
    {color: "green", value: i},
    {color: "green", value: i},
    {color: "yellow", value: i},
    {color: "yellow", value: i}
    );
  };
  let actions = ["skip", "reverse", "+2"];
  for (let action of actions) {
    orgDeck.push(
      { color: "red", value: action }, { color: "red", value: action },
      { color: "blue", value: action }, { color: "blue", value: action },
      { color: "green", value: action }, { color: "green", value: action },
      { color: "yellow", value: action }, { color: "yellow", value: action }
    );
  }
  return orgDeck;
}

function shuffleCards(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temporary = deck[i];
    deck[i] = deck[j];
    deck[j] = temporary;
  }
  
}

function dealCards(shuffledDeck) {
  playerHand = [];
  aiHand = [];
  discardPile = [];
  for (let index = 0; index < 7; index++) {
    let c1 = shuffledDeck.pop();
    playerHand.push(c1);
    let c2 = shuffledDeck.pop();
    aiHand.push(c2); 
  }
  topCard = shuffledDeck.pop();
  discardPile.push(topCard);
}



function createCard(card, hidden=false) {
  let cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  if (hidden) {
    cardDiv.classList.add("ai");  
  } else {
    cardDiv.classList.add(card.color);

    let cardDivTop = document.createElement("div");
    cardDivTop.classList.add("symbol-small", "top");
    cardDivTop.innerText = card.value;

    let cardDivMid = document.createElement("div");
    cardDivMid.classList.add("symbol-large");
    cardDivMid.innerText = card.value;

    let cardDivBottom = document.createElement("div");
    cardDivBottom.classList.add("symbol-small", "bottom");
    cardDivBottom.innerText = card.value;

    cardDiv.appendChild(cardDivTop);
    cardDiv.appendChild(cardDivMid);
    cardDiv.appendChild(cardDivBottom);
  }

  return cardDiv;
}


function renderHands(){
      let pHand = document.getElementById("player-hand");
      let aHand = document.getElementById("ai-hand");
      let disc = document.getElementById("discard-pile");

      
      pHand.innerHTML = "";
      aHand.innerHTML = "";
      disc.innerHTML = "";

      for (let i = 0; i < playerHand.length; i++) {
          let card = playerHand[i];
          let cardElement = createCard(card);

          if (i === selectedCardIndex) {
              cardElement.classList.add("selected");
          }
          cardElement.addEventListener("click", () => {
              if (selectedCardIndex === i) {
                  selectedCardIndex = null; 
              } else {
                  selectedCardIndex = i;
              }
              renderHands();
          });

          pHand.appendChild(cardElement);
      }



      for (let card of aiHand) {
          aHand.appendChild(createCard(card, true));
      }


      if (discardPile.length > 0) {
          let topCard = discardPile[discardPile.length - 1];
          disc.appendChild(createCard(topCard, false));
      }
      let turnIndicator = document.getElementById("turn-indicator");
      turnIndicator.classList.remove("turn-indicator-player", "turn-indicator-ai");
      if (isPlayerTurn) {
        turnIndicator.classList.add("turn-indicator-player");
        turnIndicator.innerText = "PLAYER";
      } else {
        turnIndicator.classList.add("turn-indicator-ai");
        turnIndicator.innerText = "AI";
  }
}

function refillDrawPile() {
  if (discardPile.length <= 1) {
    return;
  }
  let topCard = discardPile.pop();
  drawPile = discardPile;
  discardPile = [topCard];

  shuffleCards(drawPile);
}


document.getElementById("draw-pile").addEventListener("click", function() {
  if (gameOver) return;
  if (!isPlayerTurn) return;

  if (drawPile.length === 0) {
    refillDrawPile();
  }

  if (drawPile.length > 0) {
    let drawnCard = drawPile.pop();
    playerHand.push(drawnCard);
    playCardSound();


    if (isValidPlay(drawnCard, discardPile[discardPile.length - 1])) {
      isPlayerTurn = true;
      passBtn.style.display = "block";
      alert("You can play your drawn card!");
    } else {
      passBtn.style.display = "none";
      isPlayerTurn = false;
      aiTurn();
    }

    renderHands();
  } else {
    alert("No cards to draw even after refilling!");
  }

});

document.getElementById("uno-btn").addEventListener("click", function () {
  calledUNO = true;
  alert("UNO!! called");
})

function isValidPlay(card, topCard) {
  return (
    card.color === topCard.color ||
    card.value === topCard.value ||
    card.color === "wild"
  );
}


document.getElementById("play-btn").addEventListener("click", function(){
  if (gameOver) return;
  if (!isPlayerTurn) return;

  if (selectedCardIndex === null){
    alert("Select a card to discard...");
    return;
  }

  let selectedCard = playerHand[selectedCardIndex];
  let topCard = discardPile[discardPile.length - 1];

  if (isValidPlay(selectedCard, topCard)){
    playCardSound();
    playerHand.splice(selectedCardIndex, 1);
    discardPile.push(selectedCard);
    selectedCardIndex = null;
    passBtn.style.display = "none";

    if(playerHand.length === 1){
      if(!calledUNO){
        alert("UNO has not been called. penalty...");
        for(let i = 0; i < 2; i++){
          if (drawPile.length === 0) {
            refillDrawPile();
          }          
          let drawnCard = drawPile.pop();
          playerHand.push(drawnCard);                    
        }
        calledUNO = false;
      }
    }
    renderHands();

    if (selectedCard.color === "wild") {
      showWildPopup();
    } else {
      let skipOpponent = processSpecialCard(selectedCard, true);
      checkGameOver();
      if (!gameOver && !skipOpponent) {
        isPlayerTurn = false;
        aiTurn();
      } else {
        isPlayerTurn = true;
        renderHands();
      }
    }

  } else {
    alert("You can't play this card...");
  }
});


function aiWait() {
  setTimeout(aiPlayMove, 5000);
}


function aiTurn() {
  isPlayerTurn = false;
  renderHands();
  aiWait();
}

function aiPlayMove() {
  if (gameOver) return;

  let topCard = discardPile[discardPile.length - 1];
  let played = false;
  let skipPlayer = false;

  for (let i = 0; i < aiHand.length; i++) {
    let card = aiHand[i];
    if (isValidPlay(card, topCard)) {
      aiHand.splice(i, 1);
      if (card.color === "wild") {
        let colors = ["red", "blue", "green", "yellow"];
        let choice = colors[Math.floor(Math.random() * colors.length)];
        card.color = choice;
      }
      discardPile.push(card);
      playCardSound();
      if(aiHand.length === 1){
        alert("AI called UNO!!")
      }
      skipPlayer = processSpecialCard(card, false);
      played = true;
      break;
    }
  }

  if (!played) {
    if (drawPile.length === 0) refillDrawPile();
    if (drawPile.length > 0) {
      let drawnCard = drawPile.pop();
      aiHand.push(drawnCard);
      playCardSound();
    } else {
      alert("AI tried to draw but draw pile is empty even after refilling!");
    }
  }

  checkGameOver();
  
  if (!gameOver) {
    if (!skipPlayer) {
      isPlayerTurn = true;
      renderHands();
    } else {
      isPlayerTurn = false;
      renderHands();
      aiWait();
    }
  }
}





function showWildPopup() {
  document.getElementById("wild-popup").style.display = "flex";
}

function hideWildPopup() {
  document.getElementById("wild-popup").style.display = "none";
}

function selectWildColor(color) {
  discardPile[discardPile.length - 1].color = color;
  hideWildPopup();
  for (let i = 0; i < 4; i++) {
    if (drawPile.length === 0) refillDrawPile();
    if (drawPile.length > 0) {
      aiHand.push(drawPile.pop());
    }
  }
  isPlayerTurn = true;
  renderHands();
}


function processSpecialCard(card, isPlayer) {
  if (card.value === "+2") {
    for (let i = 0; i < 2; i++) {
      if (drawPile.length === 0) refillDrawPile();
      if (drawPile.length > 0) {
        if (isPlayer) {
          aiHand.push(drawPile.pop());
        } else {
          playerHand.push(drawPile.pop());
        }
      }
    }
    return true;
  }
  else if (card.value === "+4") {
    for (let i = 0; i < 4; i++) {
      if (drawPile.length === 0) refillDrawPile();
      if (drawPile.length > 0) {
        if (isPlayer) {
          aiHand.push(drawPile.pop());
        } else {
          playerHand.push(drawPile.pop());
        }
      }
    }
    return true;
  }
  else if (card.value === "skip" || card.value === "reverse") {
    return true; 
  }
  return false;
}



function checkGameOver() {
  if (playerHand.length === 0) {
    window.location.href = "win.html";
    gameOver = true;
  } else if (aiHand.length === 0) {
    window.location.href = "lose.html";
    gameOver = true;
  }
}


document.getElementById("popup-red").addEventListener("click", () => selectWildColor("red"));
document.getElementById("popup-blue").addEventListener("click", () => selectWildColor("blue"));
document.getElementById("popup-green").addEventListener("click", () => selectWildColor("green"));
document.getElementById("popup-yellow").addEventListener("click", () => selectWildColor("yellow"));


let deck = createFullDeck();
shuffleCards(deck);
dealCards(deck);
drawPile = deck;


renderHands();

passBtn.addEventListener("click", function() {
  passBtn.style.display = "none";
  isPlayerTurn = false;
  aiTurn();
  renderHands();
})

window.addEventListener('load', () => {
  document.getElementById("bgm").play().catch(() => {
    console.log("Autoplay might be blocked until user interacts.");
  });
});

