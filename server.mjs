import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Join role-based rooms for targeted notifications
    socket.on("join", (role) => {
      console.log(`Socket ${socket.id} joined room: ${role}`);
      socket.join(role);
    });

    // Handle real-time instructions/notifications
    socket.on("send-notification", (data) => {
      // data: { target: 'ADMIN' | 'INTERN' | 'ALL', title: string, message: string }
      if (data.target === "ALL") {
        io.emit("notification", data);
      } else {
        io.to(data.target).emit("notification", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Real-time Socket.io server active`);
  });
});
