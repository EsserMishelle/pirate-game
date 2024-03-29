function openingModal() {
  document.querySelector(".opening-modal").style.display = "block";
  // document.querySelector(".opening-modal").classList.style='inline';
}
//loading the opening-modal
document.addEventListener("DOMContentLoaded", openingModal);

//setting up the gridContainer
const gridContainer = document.querySelector(".grid-container");
let cards = [];
let currentPlayer = {
  name: '',
  color: "",
  bombs: 0,
  treasure: 0,
  scores: 150,
  value: ''
};
let gameOver = false;
let pirateStatusEl = document.querySelector(".pirate-status");

class Pirate {
  constructor(name, color, treasures, bombs, scores, value) {
     this.name = name;
     this.color = color;
     this.treasures = 0;
     this.bombs = 0;
     this.scores = 150;
     this.value = value;
     this.flipCard = this.playCard.bind(this);
  }

  playCard(cardEl) {
     console.log('abc');
     console.log(`${this.name} played card ${cardEl.dataset.name}`);
     alert(`${this.name} played card ${cardEl.dataset.name}`);
  }
}

const pirates = [
  new Pirate('Red Beard', 'red', 0, 0, 150, 'opt-1'),
  new Pirate('Green John Silver', 'green', 0, 0, 150, 'opt-2'),
  // new Pirate('Mean Jack Sparrow', 'black', 0, 0, 150, 'opt-3')
];

//credit: memory game javascript academy
fetch('./data/cards.json')
  .then((res) => res.json())
  .then((data) => {
     cards = [...data, ...data];
     console.log("loaded: ", cards);
     shuffleCards();
     generateCards();
  });

//reshuffleCard
function shuffleCards() {
  let currentIndex = cards.length,
     randomIndex,
     temporaryValue;
  while (currentIndex !== 0) {
     randomIndex = Math.floor(Math.random() * currentIndex);
     currentIndex -= 1;
     temporaryValue = cards[currentIndex];
     cards[currentIndex] = cards[randomIndex];
     cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let i = 0; i < 6; i++) {
     for (let j = 0; j < 7; j++) {
        // console.log(`The row is now ${i}, col is ${j}`) ////---testing
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", cards[i * 7 + j].name);
        cardElement.innerHTML = `
     <div class ="front">
     <img class = "front-image" src=${cards[i*7+j].image} />
     </div>
     <div class ="back"></div>
   `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
        // cardElement.addEventListener('dragstart', handleCardElDragStart);
        // cardElement.addEventListener('dragover', handleCardElDragOver);
        // cardElement.addEventListener('drop', handleCardElDrop);
        cardElement.dataset.row = i;
        cardElement.dataset.col = j;
     }
  }
}


function handleRedPiratePieceDragStart(event) {
  const draggedPiece = event.target;
  // const draggedPiece = event.target;
  draggedPiece.style.position = 'fixed';
  draggedPiece.style.zIndex = 1001 //ensure it is on top
  draggedPiece.style.top = `${event.clientY - draggedPiece.offsetHeight/2}px`
  draggedPiece.style.left = `${event.clientX - draggedPiece.offsetWidth/2}px`

  console.log(`Red-${draggedPiece} is at Y-${event.clientY - draggedPiece.offsetHeight/2}px 
 X-${event.clientX - draggedPiece.offsetWidth/2}px`)
  // Append the dragged piece to the container or the doc
  gridContainer.appendChild(draggedPiece);
  // Prevent the default drag behavior
  event.dataTransfer.setDragImage(redPirate, 0, 0);
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData("text/plain", 'piece');
}

function handleRedPiratePieceDragOver(event) {
  event.preventDefault();
  const targetCard = event.target.closest('.card');
  // const targetCard = event.target.closest('.card');
  // Ensure it is a valid card
  if (targetCard && !targetCard.classList.contains('occupied')) {
     targetCard.classList.add('drop-target');
  }
}

function handleRedPiratePieceDrop(event) {
  event.preventDefault();
  const draggedCardId = event.dataTransfer.getData("text/plain");
  const draggedCard = document.getElementById(draggedCardId);
  const targetCard = event.target.closest('.card');

  //check if the drop target is a valid card
  if (targetCard && !targetCard.classList.contains('occupied')) {
     //set the player's piece on the target card
     const pieceColor = currentPlayer.color;
     targetCard.classList.add('occupied', pieceColor);
     //reset currentPlayer to allow next move
     currentPlayer = 'null';
  }
  // targetCard.classList.remove('drop-target')
  const dropTargets = document.querySelectorAll('.card');
  dropTargets.forEach(card => card.classList.remove('drop-target'));

}

function handleGreenPiratePieceDragStart(event) {
  const draggedPiece = event.target;
  draggedPiece.style.position = 'fixed';
  draggedPiece.style.zIndex = 1000; //ensure it is on top
  draggedPiece.style.top = `${event.clientY - draggedPiece.offsetHeight/2}px`;
  draggedPiece.style.left = `${event.clientX - draggedPiece.offsetWidth/2}px`;

  console.log(`Green-${draggedPiece} is at Y-${event.clientY - draggedPiece.offsetHeight/2}px 
 X-${event.clientX - draggedPiece.offsetWidth/2}px`)

  //append the dragged piece to the container or the doc
  gridContainer.appendChild(draggedPiece);
  //prevent the default drag behavior
  event.dataTransfer.setDragImage(new Image(), 0, 0);
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData("text/plain", 'piece');
}

function handleGreenPiratePieceDragOver(event) {
  event.preventDefault();
  const targetCard = event.target.closest('.card');

  //ensure it is a valid card
  if (targetCard && !targetCard.classList.contains('occupied')) {
     targetCard.classList.add('drop-target');
  }
}

function handleGreenPiratePieceDrop(event) {
  event.preventDefault();
  const draggedCardId = event.dataTransfer.getData("text/plain");
  const draggedCard = document.getElementById(draggedCardId);
  const targetCard = event.target.closest('.card');

  //check if the drop target is a valid card
  if (targetCard && !targetCard.classList.contains('occupied')) {
     //set the player's piece on the target card
     const pieceColor = currentPlayer.color;
     targetCard.classList.add('occupied', pieceColor);
     //reset currentPlayer to allow next move
     currentPlayer = 'null';
  }
  // targetCard.classList.remove('drop-target')
  const dropTargets = document.querySelectorAll('.card');
  dropTargets.forEach(card => card.classList.remove('drop-target'));
}

const redPirate = document.getElementById("red-pirate-id");
const greenPirate = document.getElementById("green-pirate-id");

redPirate.addEventListener('dragstart', handleRedPiratePieceDragStart);
redPirate.addEventListener('dragover', handleRedPiratePieceDragOver);
redPirate.addEventListener('drop', handleRedPiratePieceDrop);
document.getElementById('red-pirate-id').addEventListener('dragstart', handleRedPiratePieceDragStart);
document.getElementById('red-pirate-id').addEventListener('dragover', handleRedPiratePieceDragOver);
document.getElementById('red-pirate-id').addEventListener('drop', handleRedPiratePieceDrop);

greenPirate.addEventListener('dragstart', handleGreenPiratePieceDragStart);
greenPirate.addEventListener('dragover', handleGreenPiratePieceDragOver);
greenPirate.addEventListener('drop', handleGreenPiratePieceDrop);

document.getElementById('green-pirate-id').addEventListener('dragstart', handleGreenPiratePieceDragStart);
document.getElementById('green-pirate-id').addEventListener('dragover', handleGreenPiratePieceDragStart);
document.getElementById('green-pirate-id').addEventListener('drop', handleGreenPiratePieceDrop);


//dice roll function when the user click on the dice img
function rollDice() {
  const dice1 = Math.floor(Math.random() * 4) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;

  if (dice1 === 1) {
     console.log(`Move 'North' ${dice2} spaces`)
     return (`Move 'North' ${dice2} spaces`)
  } else if (dice1 === 2) {
     console.log(`Move 'East' ${dice2} spaces`)
     return (`Move 'East' ${dice2} spaces`)
  } else if (dice1 === 3) {
     console.log(`Move 'South' ${dice2} spaces`)
     return (`Move 'South' ${dice2} spaces`)
  } else if (dice1 === 4) {
     console.log(`Move 'West' ${dice2} spaces`)
     return (`Move 'West' ${dice2} spaces`)
  }
}

const diceRollEl = document.getElementById("btnDiceRoll");
const diceResult = document.querySelector(".move-spaces") //displaying # of spaces

diceRollEl.addEventListener('click', function (event) {
  // console.log('Hello')
  const result = rollDice();
  diceResult.textContent = result;
})

//function to unflipping card
function unflipCards(dataset) {
  setTimeout(() => {
     dataset.classList.remove('flipped');
  }, 1000);
}

//function to flip the top card over
function flipCard() {
  currentPlayer = document.querySelector('input[name="player-type"]:checked');
  if (!currentPlayer) {
     // modalContainer.style.visibility= true;
     // modalContainer.style.display= "flex";
     // modalContainer.textContent=`Please select a pirate before flipping a card`
     alert('Please select a pirate before flipping a card');
     return;
  }
  const selectedPirate = pirates.find((pirate) => pirate.value === currentPlayer.value);
  // document.querySelector("#pirate-talk-id").textContent=``;
  // document.querySelector("#pirate-status-id").textContent=``;
  this.classList.add("flipped");
  //unflipping the card using set time out. 
  setTimeout(() => {
    unflipCards(this); 
    500}); 
  checkSwitchScores(selectedPirate, this.dataset.name);   
  checkReshuffle(this.dataset.name);
  checkBombs(selectedPirate, this.dataset.name);
  checkTreasures(selectedPirate, this.dataset.name);
  // checkCard(selectedPirate, this.dataset.name) ////old---checks both bombs and treasures
}

//check to see if a user (pirate) wins
function gameWon(selectedPirate) {
  document.getElementById("pirate-talk-id").textContent = `Fortune favors me. Found the cove of lost gold!!! ~~~ I won!`;

  document.querySelector("#pirate-status-id").textContent = `${selectedPirate.name}: ${selectedPirate.treasures} treasures; ${selectedPirate.scores} points`
  gameOver = true;

  const wonModal = document.querySelector(".won-modal");
  wonModal.style.display = "block";
  wonModal.style.visibility = "visible";
  // document.querySelector(".won-modal").textContent='outside modal';
  // wonModal.textContent='Modal';
  document.querySelector(".won-modal").visibility='visible';
  document.querySelector('.won-modal-content').style.display = 'block';
  // document.querySelector('.won-modal-content').visibility = 'visible'; 
  const wonModalContainer = document.querySelector(".won-modal-container");
  wonModalContainer.style.visibility = "visible";
  wonModalContainer.style.display = "block";

  setTimeout(() => {
    // console.log('lalala')
     document.querySelector('.won-modal-span1').textContent == `span1`;
    //  document.querySelector('.won-modal-content').textContent = 'content';
    //  document.querySelector(".won-modal").textContent='settimeout modal';

    //  document.querySelector(".won-modal-container").textContent='container'; //null value
    
    //  document.querySelector('.won-modal-span1').innerHTML == `Game over- ${selectedPirate.name} won. Click 'RESTART' to play again`;
  }, 2000);
  // alert(`Game over- ${selectedPirate.name} won. Click 'Restart' to play again`);
  // }, 3000);
}

//check to see if a user (pirate) loses
function gameLost(selectedPirate) {
  document.querySelector("#pirate-talk-id").textContent = `Shiver me timbers! Me been shot. Smee, SAVE ME!!!~~~ game over`

  document.querySelector("#pirate-status-id").textContent = `${selectedPirate.name}: ${selectedPirate.treasures} treasures; ${selectedPirate.scores} points`
  gameOver = true;

  const lostModal = document.querySelector(".lost-modal");
  lostModal.style.display = 'block';
  lostModal.style.visibility = "visible";
  document.querySelector(".lost-modal").visibility='visible';
  document.querySelector('.lost-modal-content').style.display = 'block';
  const lostModalContainer = document.querySelector(".lost-modal-container");
  lostModalContainer.style.visibility = "visible";
  lostModalContainer.style.display = "block";

  setTimeout(() => {
    document.querySelector('.lost-modal-span1').textContent = `Game over- ${selectedPirate.name} won. Click 'RESTART' to play again`;
    //  alert(`Game over- ${selectedPirate.name} won. Click 'Restart' to play again`);
  }, 3000);
}

function checkReshuffle(cardName) {
  if (cardName==='parrot') {
    setTimeout(() => {
      alert('MUTINY. Re-hiding treasures and bombs!')
      shuffleCards();
      gridContainer.innerHTML = '';
      generateCards();
    }, 1500);
  }
}

function checkSwitchScores(selectedPirate, cardName) {
  if (cardName==='map2') {
    console.log(`Pirate 0 is:${pirates[0]}, Pirate 1 is ${pirates[1]}`);
    console.log(selectedPirate);
      console.log(`selectedPirate is ${selectedPirate}`);
      // console.log(otherPirateVal);
    alert(`Switching pirate's status...`);
      
      // initialize a temporary pirate ;
      let tempPirate= new Pirate('', '', 0, 0, '');

      //copy every property and value from the currently selected pirate
      tempPirate=  Object.assign({}, selectedPirate);
      // console.log(tempPirate) ////checking to see if it really copied

      //establish a varible that finds radio btn that's unchecked because tempPirate is the same as the selectedPirate
      let otherPirateVal = pirates.find((pirate) => pirate.value !== tempPirate.value);
      // console.log(otherPirateVal);
     
       //establish a variable that takes everything from the radio button that's unchecked
      let otherPirate = pirates.find((pirate) => pirate.value === otherPirateVal.value);
      
      //transferring the bomb, treasure, scores value to otherPirate
      selectedPirate.bombs= otherPirate.bombs;
      selectedPirate.treasures= otherPirate.treasures;
      selectedPirate.scores= otherPirate.scores;

      //transferring the bomb, treasure, scores value from otherPirate to tempPirate
      otherPirate.bombs= tempPirate.bombs;
      otherPirate.treasures= tempPirate.treasures;
      otherPirate.scores = tempPirate.scores;

      console.log(`selectedPirate is ${selectedPirate}`);
      console.log(`otherPirate is ${otherPirate}`);
      document.querySelector("#pirate-talk-id").textContent = `Mutiny! Who's switching my treasures and scores?`

      document.querySelector("#pirate-status-id").textContent = `${selectedPirate.name}: ${selectedPirate.treasures} treasures; ${selectedPirate.scores} points`
   
  }
}
function checkTreasures(selectedPirate, cardName) {
  //old codes--- will come in handy if we want to only find specific treasures
  // const rTreasures = ['red-treasure', 'red-treasure-2'];
  // const yTreasures = ['yellow-treasure', 'yellow-treasure-2'];
  // const bTreasures = ['blue-treasure', 'blue-treasure-2'];
  // const gTreasures = ['green-treasure', 'green-treasure-2'];

  const allTreasures = ['red-treasure', 'red-treasure-2', 'yellow-treasure', 'yellow-treasure-2', 'blue-treasure', 'blue-treasure-2', 'green-treasure', 'green-treasure'];
  console.log(allTreasures);
  // if ((allTreasures.includes(cardName))) {  using allTreasures.include

  if ((cardName.includes('treasure'))) {
     console.log(cardName);
     selectedPirate.treasures += 1;
     if (selectedPirate.treasures >= 3) {
        gameWon(selectedPirate);
        return;
     } else if (selectedPirate.treasures < 3) {
        document.querySelector("#pirate-talk-id").textContent = `Ahoy, what we got here! Heave ho to this treasure chest!`
        document.querySelector("#pirate-status-id").textContent = `${selectedPirate.name}: ${selectedPirate.treasures} treasures; ${selectedPirate.scores} points`
     }
  } //display the status after a treasure/bomb card
  document.querySelector("#pirate-status-id").textContent = `${selectedPirate.name}: ${selectedPirate.treasures} treasures; ${selectedPirate.scores} points`
}

////displays pirate reaction with a bomb card 
// function checkCard(selectedPirate, cardName) {
function checkBombs(selectedPirate, cardName) {
  const allBombs = ['bomb1', 'bomb2'];
  // if (allBombs.includes(cardName)) {
  if (cardName.includes('bomb')) {
     console.log(cardName);
     selectedPirate.scores -= 50;
     if (selectedPirate.scores <= 0) {
        gameLost(selectedPirate);
        return;
     } else if (selectedPirate.scores >= 0) {
        document.querySelector("#pirate-talk-id").textContent = `Blimey, who hid a bomb here? Caused me to lose 50 points`
        document.querySelector("#pirate-status-id").textContent = `${selectedPirate.name}: ${selectedPirate.treasures} treasures; ${selectedPirate.scores} points`
     }
  }
}

//restart the game
function reset() {
  let cards = [];
  shuffleCards();
  // const gridContainer = document.querySelector(".grid-container");
  gridContainer.innerHTML = '';
  generateCards();
  
  // resetting every pirate's properties 
  pirates.forEach((pirate)=> {
    pirate.bombs=0,
    pirate.treasures= 0,
    pirate.scores= 150
  
  });
  
  //uncheck the radio button
  document.querySelector('input[name="player-type"]:checked').checked= false;
  //check on pirate status, should be reset for treasures, scores, bombs;
  console.log(pirates);

  gameOver = false;
  // const pirateStatusEl = document.querySelector("pirate-status")
  pirateStatusEl = ''; //document.querySelector("pirate-status")
  pirateStatusEl.textContent = ''; // clear the pirate status text
  // document.querySelector('input[name="player-type"]:checked').value='';
  document.querySelector("#pirate-talk-id").textContent = ``;
  document.querySelector("#pirate-status-id").textContent = ``;
}

const btnReset = document.getElementById("btn-reset");
btnReset.addEventListener('click', start);

function start() {
  document.getElementById('opening-modal-id').style.display = 'none';
}

const btnModalStart = document.getElementById("btn-modal-start");
btnModalStart.addEventListener('click', start) 

//buttons on the won modal
function wonStart () {
  document.querySelector(".won-modal").style.display = 'none';
  reset();
}
const btnWonModalStart= document.getElementById('btn-won-modal-start');
btnWonModalStart.addEventListener('click', wonStart)

function wonSpan2() {
  document.querySelector(".won-modal").style.display = 'none';
  alert('Until next adventure--- So long!');
}
const btnWonModalSpan2 = document.querySelector('.won-modal-span2') 
btnWonModalSpan2.addEventListener('click', wonSpan2);

//buttons on the lost modal
function lostStart () {
  document.querySelector(".lost-modal").style.display = 'none';
  reset();
}

const btnLostModalStart= document.getElementById('btn-lost-modal-start');
btnLostModalStart.addEventListener('click', lostStart);

document.getElementById('lost-modal-id').style.display='none';

function lostSpan2() {
  document.querySelector(".lost-modal").style.display = 'none';
  alert('Until next adventure--- So long!');
}
const btnLostModalSpan2 = document.querySelector('.lost-modal-span2') 
btnLostModalSpan2.addEventListener('click', lostSpan2);