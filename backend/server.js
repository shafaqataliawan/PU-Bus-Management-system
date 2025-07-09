const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const initializeSocket = require('./socket');
const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/driverRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const busRoutes = require('./routes/busRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const formRoutes = require('./routes/formregisterRoutes');
const routeRoutes = require('./routes/routeRoutes');

dotenv.config();
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bus_tracking';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// API Routes
app.use('/api/form', formRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'signup.html'));
});

app.get('/routes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'routes.html'));
});

app.get('/ad-routes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'ad-routes.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});