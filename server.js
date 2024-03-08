const express = require("express");
const next = require("next");
// const axios = require("axios");
const http = require("http");
const socketIO = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

let users = [];

app.prepare().then(async () => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketIO(httpServer);

  const connectTwo = () => {
    const user1 = users.pop();
    const user2 = users.pop();

    if (!user1.connected || !user2.connected) return;

    user1.emit("connected");

    user2.emit("connected");

    user1.on("message", (msg) => {
      user2.emit("message", msg);
    });

    user2.on("message", (msg) => {
      user1.emit("message", msg);
    });

    user1.on("typing", () => {
      user2.emit("typing");
    });

    user2.on("typing", () => {
      user1.emit("typing");
    });

    user1.on("disconnect", () => {
      user2.emit("match-disconnected");
      user2.disconnect();
    });

    user2.on("disconnect", () => {
      user1.emit("match-disconnected");
      user1.disconnect();
    });
  };

  io.on("connection", (socket) => {
    users.push(socket);
    socket.emit("enqueue");

    socket.on("disconnect", () => {
      users = users.filter((u) => u.id === socket.id);
      socket.disconnect();
    });

    if (users.length > 1) {
      connectTwo();
    }
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
