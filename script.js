const gameBoard  = (() => {
    const cells = document.querySelectorAll('.cell');

    let origBoard;
    let opponentPlayer = 'unbeatAi';
    console.log(opponentPlayer);

    let huPlayer = 'O';
    const aiPlayer = 'X';
    const opponent = 'Y';
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

    function setPlayer(player) {
        huPlayer = 'O'
        opponentPlayer = player;
        startGame();
    }

    startGame();

    function handleCellClick(e) {
        turnClick(e.target.id, huPlayer);
    }

    function startGame() {
        document.querySelector('.endgame').style.display = 'none';
        origBoard = Array.from(Array(9).keys());
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = '';
            cells[i].style.removeProperty('background-color');
            cells[i].removeAttribute('disabled'); 
            cells[i].addEventListener('click', handleCellClick);
            
        }

    }

    function changeTurn() {
         huPlayer = huPlayer == 'O' ? 'X' : 'O'
    }

    function turnClick(square, player) {
        if (typeof origBoard[square] == 'number') {
            turn(square, player);
            if (opponentPlayer != 'human') {
                if (!checkTie()) turn(bestSpot(), aiPlayer);
            } else if (opponentPlayer === 'human') {
                changeTurn();
                checkTie();
            }
        }
    }

    function turn(squareId, player) {
        origBoard[squareId] = player;
        const cell = document.getElementById(squareId);
        cell.innerText = player;
        cell.style.color = player === 'O' ? '#EA5455' : '#19376D'; 
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
            document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "green" : "red";
        }
        for(let i = 0; i < cells.length; i++) {
            cells[i].removeEventListener('click', handleCellClick);     
        }
       console.log(gameWon.player)
        declareWinner(gameWon.player == "O" ? "You win :)" : "Robot or Opponent Win : (")
    }

    function bestSpot() {
        if (opponentPlayer == 'easyAi') {
            return emptySquares()[0];
        }else if(opponentPlayer == 'unbeatAi') {
            return minmax(origBoard, aiPlayer).index;
        }
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
               cells[i].style.backgroundColor = 'goldenrod';
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
     startGame,
     setPlayer
 }
})();


const displayController = (() => {
    const changeOption = document.getElementById('change-option');
    const humanAiEasy = document.getElementById('ha1');
    const humanAiUnbeat = document.getElementById('ha2');
    const humanHuman = document.getElementById('hh');
    const turnContainer = document.getElementById('turn');


    humanAiEasy.addEventListener('click', () => changePlayer('easyAi'));
    humanAiUnbeat.addEventListener('click', () => changePlayer('unbeatAi'));
    humanHuman.addEventListener('click', () => changePlayer('human'));

    changeOption.addEventListener('click', showChangePlayer);

    function changePlayer(player) {
        if (player == 'easyAi') {
            turnContainer.innerText = 'Human vs FoolAI';
            gameBoard.setPlayer(player)
        }else if (player == 'unbeatAi'){
            turnContainer.innerText = 'Human vs CleverAi';
            gameBoard.setPlayer(player) ;
        }else {
            turnContainer.innerText = 'Human vs Human';
            gameBoard.setPlayer(player);
        }
    }

    function showChangePlayer() {
        document.querySelector('.endgame').style.display = 'flex';
        document.querySelector('.endgame .text').innerText = 'Change Player~';
    }

})();