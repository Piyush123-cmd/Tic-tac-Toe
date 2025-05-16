const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public")); // Serve static files

let waitingPlayer = null;
let games = {}; // Store active games

io.on("connection", (socket) => {
    console.log("A player connected:", socket.id);

    // When a player clicks "Play Online"
    socket.on("joinGame", (playerName) => {
        if (waitingPlayer === null) {
            waitingPlayer = socket;
            waitingPlayer.playerName = playerName;
            socket.emit("waitingForPlayer");
        } else {
            const room = `${waitingPlayer.id}-${socket.id}`;
            games[room] = { players: [waitingPlayer, socket], board: Array(9).fill(""), turn: "X" };

            waitingPlayer.join(room);
            socket.join(room);

            io.to(room).emit("startGame", {
                room,
                players: [waitingPlayer.playerName, playerName],
            });

            waitingPlayer = null;
        }
    });

    // When a player makes a move
    socket.on("makeMove", ({ room, index }) => {
        if (games[room]) {
            const game = games[room];
            if (game.board[index] === "" && game.turn === "X") {
                game.board[index] = "X";
                game.turn = "O";
            } else if (game.board[index] === "" && game.turn === "O") {
                game.board[index] = "X";
                game.turn = "X";
            }
            io.to(room).emit("updateBoard", { board: game.board, turn: game.turn });
        }
    });

    // When a player disconnects
    socket.on("disconnect", () => {
        console.log("A player disconnected:", socket.id);
        waitingPlayer = null;
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
