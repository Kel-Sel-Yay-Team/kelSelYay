import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from '../routes/handleMissingPerson.js';

dotenv.config(); //get mongo_uri
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/reports', router);


//host the server
app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
