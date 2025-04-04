import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/handleMissingPerson.js';
import cors from 'cors'
dotenv.config(); //get mongo_uri
const app = express();
app.use(express.json());
// In your server/index.js or server/app.js file
// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3001','https://www.kelselyay.com'], // Your Next.js client URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/reports', router);

//DELETE ALL reports — for deployment reset only
router.delete('/delete/all', async (req, res) => {
  try {
    await MissingPerson.deleteMany({});
    res.status(200).json({ success: true, message: 'All reports deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

//host the server
app.listen(process.env.PORT || 3002);
//app.listen(3002, () => console.log('Backend running on http://localhost:3002'));