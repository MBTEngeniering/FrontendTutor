//require('dotenv').config(); // Load environment variables from .env file

import express from "express";
 // Import Express framework
import cors from "cors";
 // Import CORS middleware
import http from "http"; // Import Node's HTTP module
import { Server } from "socket.io"; // Import Socket.IO Server class


//
// const socketIO = new Server();
// Create an Express application
const app = express();
app.use(cors());

const server = http.createServer(app);


// Initialize a new instance of Socket.IO by passing the HTTP server
const socketIO = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin and my frontend port = 5173
    methods: ["GET", "POST"], // Allow these HTTP methods
  },
});


/*
// Use CORS middleware to enable cross-origin requests
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies


// Create an HTTP server using the Express app
const server = http.createServer(app);


// Initialize a new instance of Socket.IO by passing the HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin and my frontend port = 5173
    methods: ["GET", "POST"], // Allow these HTTP methods
  },
});


// Listen for incoming Socket.IO connections
io.on("connection", (socket) => {
  console.log("User connected ", socket.id); // Log the socket ID of the connected user

  // Listen for "send_message" events from the connected client
  socket.on("send_message", (data) => {
    console.log("Message Received ", data); // Log the received message data

    // Emit the received message data to all connected clients
    io.emit("receive_message", data);
  });
});

const PORT = 3003; // Define a default port if PORT is not set in .env


//if you use mongodb then you can paste this code lines.
server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
*/
const PORT = 3003; // Define a default port if PORT is not set in .env
let users = []

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`)
  socket.on("message", data => {
    socketIO.emit("messageResponse", data)
  })

  socket.on("typing", data => (
      socket.broadcast.emit("typingResponse", data)
  ))

  socket.on("newUser", data => {
    users.push(data)
    socketIO.emit("newUserResponse", users)
  })

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    users = users.filter(user => user.socketID !== socket.id)
    socketIO.emit("newUserResponse", users)
    socket.disconnect()
  });
});

app.get("/api", (req, res) => {
  res.json({message: "Hello"})
});


server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
