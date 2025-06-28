let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;
let isMultiplayer = false;
let playerName = "";
let mPlayerName = "";


const tiles = document.querySelectorAll(".play");
const turnText = document.querySelector(".turn");
const resultText = document.querySelector(".result");
const selectScreen = document.querySelector(".select");
const gameScreen = document.querySelector(".game");
const startScreenSingle = document.querySelector(".startScreen");
const startScreenMulti = document.querySelector(".mStartScreen");
const inputSection = document.querySelector(".input");
const teaseBox = document.querySelector(".tease");
const nameInput = document.getElementById("name");
const name1Input = document.getElementById("name1");
const name2Input = document.getElementById("name2");
const singleBtn = document.querySelector(".single");
const multiBtn = document.querySelector(".double");
const slate = document.querySelector(".slate");

initGame();

singleBtn.addEventListener("click", () => {
  selectScreen.style.display = "none";
  inputSection.style.display = "flex";
  startScreenSingle.style.display = "flex";
  isMultiplayer = false;
});

multiBtn.addEventListener("click", () => {
  selectScreen.style.display = "none";
  inputSection.style.display = "flex";
  startScreenMulti.style.display = "flex";
  isMultiplayer = true;
});

function assignName() {
  if (isMultiplayer) {
    playerName = name1Input.value;
        mPlayerName = name2Input.value;
      if (playerName == ""){
        alert("Enter Names first")
        return false;
      }
        
     
  } else {
    playerName = nameInput.value; 
    if (playerName == ""){
    alert("Enter Name first")
    return false;
  }
    
  turnText.textContent = `${playerName}'s turn`;
}
  return true;
}

function start() {
  if(!assignName()){return ;}
  inputSection.style.display = "none";
  gameScreen.style.display = "flex";
  turnText.textContent = `${playerName}'s turn`;
}

function mainMenu() {
  playAgain();
  selectScreen.style.display = "flex";
  gameScreen.style.display = "none";

}

function initGame() {
  tiles.forEach((tile, index) => {
    tile.addEventListener("click", () => {
      if (gameOver || (!isMultiplayer && currentPlayer === "O")) return;
      if (tile.textContent === "") {
        move(tile, index);
      }
      else return;
      if(checkWin()){
        resultText.style.color="green";
         resultText.textContent =currentPlayer==="X"?  `${playerName} Won 🎖️`:`${mPlayerName} Won 🎖️`;
        }
        if(checkDraw()){
        resultText.textContent ="It is a Draw"
          }
        turnChange();
        if (!isMultiplayer) {
  setTimeout(() => {
    aiTurn();

    if (checkWin()) {
      resultText.style.color="red";
      resultText.textContent =`AI Won 🤪`;
      gameOver = true;
      return;
    } else if (checkDraw()) {
      resultText.textContent = "It is a Draw";
      gameOver = true;
      return;
    }

    turnChange();
  }, 600); // 600ms delay
}
    });
  });
}

function move(tile, index) {
  if (gameOver) return;
  
  tile.textContent = currentPlayer;
  board[index] = currentPlayer;
  
}

function turnChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  
  if (isMultiplayer) {
    turnText.textContent = currentPlayer === "X" ? 
      `${playerName}'s turn` : 
      `${mPlayerName}'s turn`;
  } else {
    turnText.textContent = currentPlayer === "X" ? 
      `${playerName}'s turn` : 
      "AI's turn";
  }
}

function checkWin() {
  const winConditions = [
    { combo: [0, 1, 2], class:  "strike-row-1" },
    { combo: [3, 4, 5], class: "strike-row-2" },
    { combo: [6, 7, 8], class: "strike-row-3" },
    { combo: [0, 3, 6], class: "strike-col-1" },
    { combo: [1, 4, 7], class: "strike-col-2" },
    { combo: [2, 5, 8], class: "strike-col-3" },
    { combo: [0, 4, 8], class: "strike-dig-1" },
    { combo: [2, 4, 6], class: "strike-dig-2" }
  ];

  for (const condition of winConditions) {
    const [a, b, c] = condition.combo;
    if (board[a] === currentPlayer && board[b] === currentPlayer && board[c] === currentPlayer) {
      gameOver = true;
      slate.classList.add(condition.class);
      return true;
    }
  
    
  }
  return false;
}

function checkDraw() {
  return !board.includes("") && !checkWin();

}

function aiTurn() {
  let emptyBoard = [];
  for(let i = 0 ; i < board.length ; i++){
    if(board[i]==""){
      emptyBoard.push(i);
    }
  }
   let key = findWinningMove("O");
   if(key !== -1 && board[key]==""){
      move(tiles[key],key);
    return;
   }
   key = findWinningMove("X");
   if(key !== -1 && board[key]==""){
    move(tiles[key],key);
    return;
   }
   else if(key==-1 && board[4]==""){
    move(tiles[4],4);
    return;
   }
  const randomIndex = Math.floor(Math.random() * emptyBoard.length);
  const randomMove = emptyBoard[randomIndex];
  move(tiles[randomMove], randomMove);
  return;
}
  


function findWinningMove(player) {
  const winConditions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  
  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (board[a] === player && board[b] === player && board[c] === "") return c;
    if (board[a] === player && board[c] === player && board[b] === "") return b;
    if (board[b] === player && board[c] === player && board[a] === "") return a;
  }
  
  return -1;
}


function playAgain() {
  board = ["","","","","","","","",""]
  for(let i = 0 ; i < tiles.length ; i++){
    tiles[i].textContent = "";
    gameOver=false;
    currentPlayer = "X"
    turnText.textContent = "";
    inputSection.style.display = "none";
    startScreenSingle.style.display="none";
    startScreenMulti.style.display="none";
    resultText.textContent = ""
    slate.classList.remove(
    "strike-row-1",
    "strike-row-2",
    "strike-row-3",
    "strike-col-1",
    "strike-col-2",
    "strike-col-3",
    "strike-dig-1",
    "strike-dig-2"
  );
  resultText.style.color="#ffdead";
  }
}