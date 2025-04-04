const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const router = require('./routes/handleMissingPerson.js');
const cors = require('cors');

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3001', 'https://www.kelselyay.com'], // Your Next.js client URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Use the router for /api/reports
app.use('/api/reports', router);

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));