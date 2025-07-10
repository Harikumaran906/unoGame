let playerHand = [
  { color: "red", value: 8 },
  { color: "blue", value: "+2" },
  { color: "wild", value: "+4" }
];
let aiHand = [
  { color: "red", value: 8 },
  { color: "blue", value: "+2" },
  { color: "green", value: 3 }
];
let discardPile = [
  { color: "red", value: 5 }
];

let selectedCardIndex = null;
let isPlayerTurn = true;



let drawPile = [
  { color: "yellow", value: 3 },
  { color: "green", value: 9 },
  { color: "green", value: 2 },
  { color: "red", value: 9 },
  { color: "green", value: 4 },
  { color: "red", value: "+2" },
  { color: "green", value: "+2" },
  { color: "blue", value: 9 },
  { color: "blue", value: 6 },
  { color: "green", value: 7 },
  { color: "yellow", value: 8 },
  { color: "green", value: 0 },
  { color: "yellow", value: 9 },
  { color: "red", value: 1 },
  { color: "green", value: 9 },
  { color: "wild", value: "+4" },
  { color: "blue", value: 2 },
];


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
document.getElementById("draw-pile").addEventListener("click", function() {
  if (drawPile.length > 0) {
    let drawnCard = drawPile.pop();
    playerHand.push(drawnCard);
    renderHands();
  } else {
    alert("No cards to draw!");
  }
});

function isValidPlay(card, topCard) {
  return (
    card.color === topCard.color ||
    card.value === topCard.value ||
    card.color === "wild"
  );
}

document.getElementById("play-btn").addEventListener("click", function(){
  if (selectedCardIndex === null){
    alert("Select a card to discard...");
    return;
  }
  let selectedCard = playerHand[selectedCardIndex];
  let topCard = discardPile[discardPile.length - 1];
  if (isValidPlay(selectedCard, topCard)){
    playerHand.splice(selectedCardIndex, 1);
    discardPile.push(selectedCard);
    selectedCardIndex = null;
    isPlayerTurn = false;
    renderHands();
    aiTurn();
  }else{
    alert("You cant play this card...");
  }
})

function aiTurn() {
  isPlayerTurn = false;
  renderHands();
  setTimeout(aiPlayMove, 5000);
}

function aiPlayMove() {
  let topCard = discardPile[discardPile.length - 1];
  let played = false;

  for (let i = 0; i < aiHand.length; i++) {
    let card = aiHand[i];
    if (isValidPlay(card, topCard)) {
      aiHand.splice(i, 1);
      discardPile.push(card);
      played = true;
      break;
    }
  }

  if (!played) {
    if (drawPile.length > 0) {
      let drawnCard = drawPile.pop();
      aiHand.push(drawnCard);
    } else {
      alert("AI tried to draw but draw pile is empty!");
    }
  }

  isPlayerTurn = true;
  renderHands();
}

renderHands();