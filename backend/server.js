const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const ordersRoutes = require('./routes/orders');
const waitersRoutes = require('./routes/waiters');
const userRoutes = require('./routes/user')

// express app
const app = express();

// Create HTTP server manually
const server = http.createServer(app);

// Create Socket.IO instance and attach to HTTP server
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173', // local dev
      'https://kitchen-connect-tdoy.onrender.com' // production
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
  }
});


// Middleware to attach io to app
app.set('io', io);

// Middleware
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: ['http://localhost:5173', 'https://kitchen-connect-tdoy.onrender.com'],
  credentials: true
}));

// Routes
app.use('/api/waiters', waitersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/user', userRoutes)

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});





// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log('Connected to DB & listening on port', process.env.PORT);
    });
  })
  .catch((err) => console.log(err));
