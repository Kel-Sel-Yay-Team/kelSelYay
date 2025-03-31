import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Test from './models/Test.js';

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => res.send('API is working'));

app.post('/test', async (req, res) => {
  try {
      const test = new Test({ message: req.body.message });
      await test.save();
      res.status(201).json({ success: true, data: test });
  } catch (err) {
      res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
