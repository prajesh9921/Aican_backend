const express = require("express");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require("dotenv");
const fs = require('fs');  // Add this line to include the fs module

// Initialize app and server
dotenv.config();
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: 'https://heyhomie.netlify.app',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3500;
const HOST = process.env.HOST || "localhost";

// Event listener for socket connections
io.on('connection', (socket) => {
  socket.on('text', (text) => {
    fs.writeFile('savedText.txt', text, (err) => {
      if (err) {
        console.error('Error writing to file', err);
      }
    });
    // Broadcast the text to other clients
    socket.broadcast.emit('gettext', text);
  }); 
});

// Endpoint to retrieve saved text
app.get("/gettext", async (req, res) => {
  fs.readFile('savedText.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
      res.status(500).json({ message: "Error reading file" });
    } else {
      res.status(200).json({ text: data });
    }
  });
});

// Default route
app.get("/", async (req, res) => {
  res.json({ message: "Default Route" });
});

// Handle undefined routes
app.use("/*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
