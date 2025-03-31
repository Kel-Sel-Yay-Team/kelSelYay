import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import reportRoute from '../routes/handleMissingPerson.js';

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/reports', reportRoute)

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
