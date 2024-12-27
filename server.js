const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an express application
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up view engine (EJS)
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Serve the login page
app.get('/', (req, res) => {
  res.render('login');
});

// Serve the chat page
app.get('/chat', (req, res) => {
  res.render('index');
});

// Handle WebSocket connections
let users = {}; // To keep track of logged-in users

io.on('connection', (socket) => {
  console.log('A user connected: ', socket.id);

  // Handle incoming messages
  socket.on('chat message', (msg, sender) => {
    console.log(`Message from ${sender}: ${msg}`);
    io.emit('chat message', msg, sender); // Broadcast message to all clients
  });

  // Handle typing event
  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username); // Broadcast typing status
  });

  // Handle stop typing event
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing'); // Broadcast stop typing
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
