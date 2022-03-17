
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
        // return emptySquares()[0];
        return minmax(origBoard, aiPlayer).index;
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

    function minmax(newBoard, player){
        let availSpots = emptySquares(newBoard);

        if (checkWin(newBoard, player)) {
            return {score: -10};
        }else if (checkWin(newBoard, aiPlayer)) {
            return {score: 10};
        }else if(availSpots.length === 0) {
            return {score: 0}
        }

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minmax(newBoard, huPlayer);
            move.score = result.score;
        }else {
            var result = minmax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;
        for(let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
        }else {
            let bestScore = 10000;
            for(let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    
    }
 return {
     startGame
 }
})();


//change following code from here to right place
// const rePlayBtn = document.getElementById('replay');
// rePlayBtn.addEventListener('click', gameBoard.startGame);