const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Replace '*' with your React Native app URL if needed
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Store connected clients
const clients = new Map();

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  clients.set(socket.id, socket);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    clients.delete(socket.id);
  });
});

// API endpoint to send notifications

app.post('/send-message', (req, res) => {
    const { message, clientId } = req.body;
    if (clientId) {
      io.to(clientId).emit('receive-message', message);
      res.json({ message: `Message sent to client ${clientId}` });
    } else {
      io.emit('receive-message', message);
      res.json({ message: 'Message broadcasted to all clients' });
    }
  });
  
  app.post('/send-notification', (req, res) => {
    const { title, message } = req.body;
  
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }
  
    // Emit notification event
    io.emit('notification', { title, message });
    res.status(200).json({ success: true, message: 'Notification broadcasted to all clients' });
  });
  const messages = new Map(); // {clientId: [messages]}

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
  
    // Store socket id for reconnections
    socket.on('register', (clientId) => {
      messages.set(clientId, messages.get(clientId) || []);
    });
  
    // Send missed messages
    socket.on('fetch-missed', (clientId) => {
      const missedMessages = messages.get(clientId) || [];
      socket.emit('missed-messages', missedMessages);
      messages.set(clientId, []); // Clear after sending
    });
  
    // On disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
  
  // Send messages with tracking
  app.post('/send-message', (req, res) => {
    const { message, clientId } = req.body;
  
    if (clientId) {
      const clientSocket = io.sockets.sockets.get(clientId);
      if (clientSocket) {
        clientSocket.emit('receive-message', message);
      } else {
        // Store as missed message
        const clientMessages = messages.get(clientId) || [];
        clientMessages.push(message);
        messages.set(clientId, clientMessages);
      }
      res.json({ status: 'sent to specific client or stored as missed' });
    } else {
      io.emit('receive-message', message); // Broadcast
      res.json({ status: 'broadcasted' });
    }
  });
    

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
