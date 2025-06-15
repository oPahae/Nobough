import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Initialisation de Socket.IO...");

    io = new Server(res.socket.server, {
      path: "/api/_lib/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {

      socket.on("sendMessage", (message) => {
        console.log("Message recived :", message);
        io.emit("newMessage", message);
      });

      socket.on("disconnect", () => {
      });
    });
  }

  res.end();
}