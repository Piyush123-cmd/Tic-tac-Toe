document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const restartButton = document.getElementById("restartButton");
    const statusMessage = document.getElementById("statusMessage");
    const player1Score = document.getElementById("player1Score");
    const player2Score = document.getElementById("player2Score");
    const player1Name = document.getElementById("player1Name");
    const player2Name = document.getElementById("player2Name");

    let currentPlayer = "X";
    let board = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;
    let scores = { X: 0, O: 0 };

    // ✅ Load Player Name (Human) and Set "Computer"
    let player1 = localStorage.getItem("player1") || "Player";
    let player2 = "Computer"; // Computer as opponent

    player1Name.textContent = player1;
    player2Name.textContent = player2;

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameActive = false;
                highlightWinningCells(combination);
                updateScore(board[a]);
                statusMessage.textContent = `${board[a] === "X" ? player1 : "Computer"} Wins! 🎉`;
                return;
            }
        }

        if (!board.includes("") && gameActive) {
            gameActive = false;
            statusMessage.textContent = "It's a Draw!";
        }
    }

    function highlightWinningCells(combination) {
        combination.forEach(index => {
            cells[index].classList.add("win");
        });
    }

    function updateScore(player) {
        scores[player]++;
        if (player === "X") {
            player1Score.textContent = scores.X;
        } else {
            player2Score.textContent = scores.O;
        }
    }

    function computerMove() {
        if (!gameActive) return;

        // Find empty cells
        let emptyCells = board.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);

        if (emptyCells.length === 0) return; // No moves left

        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomIndex] = "O";
        cells[randomIndex].textContent = "O";
        cells[randomIndex].style.color = "blue";

        checkWinner();
        if (gameActive) {
            currentPlayer = "X"; // Switch back to human
        }
    }

    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => {
            if (board[index] === "" && gameActive && currentPlayer === "X") {
                board[index] = "X";
                cell.textContent = "X";
                cell.style.color = "red";
                checkWinner();

                if (gameActive) {
                    currentPlayer = "O"; // Switch to computer
                    setTimeout(computerMove, 500); // Delay computer move
                }
            }
        });
    });

    restartButton.addEventListener("click", () => {
        board = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        currentPlayer = "X";
        statusMessage.textContent = "New Game! 🎮";
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("win");
        });
    });
});
