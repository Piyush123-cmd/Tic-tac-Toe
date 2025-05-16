const socket = io();
let room = null;
let playerSymbol = "X";
let gameActive = false;

// Join game when page loads
window.onload = () => {
    const playerName = prompt("Enter your name:");
    if (playerName) {
        socket.emit("joinGame", playerName);
    }
};

socket.on("waitingForPlayer", () => {
    document.getElementById("status").textContent = "Waiting for an opponent...";
});

socket.on("startGame", (data) => {
    room = data.room;
    document.getElementById("status").textContent = `Playing against ${data.players[1]}`;
    gameActive = true;
});

// Handle moves
document.querySelectorAll(".cell").forEach((cell, index) => {
    cell.addEventListener("click", () => {
        if (gameActive && cell.textContent === "") {
            socket.emit("makeMove", { room, index });
        }
    });
});

socket.on("updateBoard", (data) => {
    document.querySelectorAll(".cell").forEach((cell, index) => {
        cell.textContent = data.board[index];
    });
    document.getElementById("status").textContent = `Turn: ${data.turn}`;
});

// Handle Restart
document.getElementById("restartButton").addEventListener("click", () => {
    window.location.reload();
});
