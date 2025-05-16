document.addEventListener("DOMContentLoaded", () => {
    console.log("Game Loaded!");

    const cells = document.querySelectorAll(".cell");
    const restartButton = document.getElementById("restartButton");
    const statusMessage = document.getElementById("statusMessage");
    const playerXScore = document.getElementById("playerXScore");
    const playerOScore = document.getElementById("playerOScore");
    const playerXName = document.getElementById("playerXName");
    const playerOName = document.getElementById("playerOName");
    const playerXAvatar = document.getElementById("playerXAvatar");
    const playerOAvatar = document.getElementById("playerOAvatar");

  
    

    let currentPlayer = "X";
    let board = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;
    let scores = { X: 0, O: 0 };

    // ✅ Get Player Names & Set Default Avatars
    let playerX = localStorage.getItem("player1") || "Player X";
    let playerO = localStorage.getItem("player2") || "Player O";

    

    playerXName.textContent = playerX;
    playerOName.textContent = playerO;
    

    function checkWinner() {
        console.log("Checking Winner...");
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                console.log(`${board[a]} Wins!`);
                gameActive = false;
                highlightWinningCells(combination);
                updateScore(board[a]);
                statusMessage.textContent = `${board[a] === "X" ? playerX : playerO} Wins! 🎉`;
                return;
            }
        }

        if (!board.includes("") && gameActive) {
            console.log("It's a Draw!");
            gameActive = false;
            statusMessage.textContent = "It's a Draw!";
        }
    }

    function highlightWinningCells(combination) {
        console.log("Highlighting Winning Cells...");
        combination.forEach(index => {
            cells[index].classList.add("win");
        });
    }

    function updateScore(player) {
        console.log(`Updating Score for ${player}...`);
        scores[player]++;
        if (player === "X") {
            playerXScore.textContent = scores.X;
        } else {
            playerOScore.textContent = scores.O;
        }
    }

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            console.log(`Cell ${index} clicked by ${currentPlayer}`);
            if (board[index] === "" && gameActive) {
                board[index] = currentPlayer;
                cell.textContent = currentPlayer;
                cell.style.color = (currentPlayer === "X") ? "red" : "blue";
                checkWinner();
                if (gameActive) {
                    currentPlayer = (currentPlayer === "X") ? "O" : "X";
                }
            }
        });
    });

    restartButton.addEventListener("click", () => {
        console.log("Restarting Game...");
        board = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        currentPlayer = "X";
        statusMessage.textContent = "New Game! 🎮";
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("win");
        });
    });

    console.log("Game Ready!");
});
