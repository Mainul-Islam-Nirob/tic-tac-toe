
const gameBoard  = (() => {
    let origBoard;
    const huPlayer = 'O';
    const aiPlayer = 'X';
    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ]

    const cells = document.querySelectorAll('.cell');
    startGame();

    function startGame() {
        document.querySelector('.endgame').style.display = 'none';
        origBoard = Array.from(Array(9).keys());
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = '';
            cells[i].style.removeProperty('background-color');
            cells[i].addEventListener('click', turnClick);
        }
    }
    function turnClick(square) {
        if (typeof origBoard[square.target.id] == 'number') {
            turn(square.target.id, huPlayer);
            if (!checkTie()) turn(bestSpot(), aiPlayer);
        }
    }

    function turn(squareId, player) {
        origBoard[squareId] = player;
        document.getElementById(squareId).innerText = player;
        let gameWon = checkWin(origBoard, player);
        if (gameWon) gameOver(gameWon);
    }

    function checkWin(board, player){
        let plays = board.reduce((a, e, i) => 
            (e === player) ? a.concat(i) : a, []);
        let gameWon = null;
        for(let [index, win] of winCombos.entries()) {
            if(win.every(element => plays.indexOf(element) > -1)){
                gameWon = {index: index, player: player};
                break;
            }
        }
        return gameWon;
    }

    function gameOver(gameWon) {
        for (let index of winCombos[gameWon.index]) {
            document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "aqua" : "yellow";
        }
        for(let i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner(gameWon.player == huPlayer ? "You win :)" : "You Loos :(")
    }

    function bestSpot() {
        return emptySquares()[0];
    }

    function declareWinner(who) {
        document.querySelector('.endgame').style.display = 'flex';
        document.querySelector('.endgame .text').innerText = who;

    }

    function emptySquares() {
        return origBoard.filter(s => typeof s == 'number');
    }

    function checkTie() {
        if (emptySquares().length == 0) {
            for (let i = 0; i < cells.length; i++) {
               cells[i].style.backgroundColor = 'green';
               cells[i].removeEventListener('click', turnClick);
            }
            declareWinner('Tie Game!');
            return true;
        }
        return false;
    }
    
 return {
     startGame
 }
})();


//change following code from here to right place
// const rePlayBtn = document.getElementById('replay');
// rePlayBtn.addEventListener('click', gameBoard.startGame);