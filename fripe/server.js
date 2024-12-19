const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const Chat = require('./models/Chat'); // Ensure you have the Chat model

// Import Routes
const clientRoutes = require('./routes/clientRoutes');
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const articleRoutes = require('./routes/articleRoutes');
const orderArticleRoutes = require('./routes/orderArticleRoutes');
const settingsRoutes = require('./routes/settings');
const paymentRoutes = require('./routes/payment');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from your frontend
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// Database Connection
mongoose
  .connect('mongodb://localhost:27017/boutique', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api', chatRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/user', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', articleRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', orderArticleRoutes);
app.use('/api', paymentRoutes);

// Socket.IO Logic
io.on('connection', (socket) => {
  // Listen for new messages
  socket.on('newMessage', async (data) => {
    // Remove _id if present to allow MongoDB to generate it automatically
    delete data._id;

    // Emit the message immediately for instant display
    io.emit('receiveMessage', { ...data, tempId: socket.id + Date.now() });
  
    try {
      // Save to database asynchronously
      const newChat = new Chat(data);
      await newChat.save();
    } catch (err) {
      console.error('Error saving chat message:', err);
      // Optionally emit an error event if save fails
      socket.emit('messageError', { error: 'Failed to save message' });
    }
  });

  // Disconnect event
  socket.on('disconnect', () => {
    
  });
});

// Start the Server
server.listen(5000, () => {
  console.log('Server is running on port 5000');
});