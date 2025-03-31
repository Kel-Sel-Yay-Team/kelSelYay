import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import reportRoute from '../routes/handleMissingPerson.js';

dotenv.config(); //get mongo_uri
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => res.send('API is working'));


//input: reporterName, the id of the request
app.delete('/missing-person/:id', async (req, res) => {
  const { reporterName } = req.body;

  if (!reporterName) {
      return res.status(400).json({ success: false, error: 'Reporter name is required for deletion.' });
  }

  try {
      const report = await MissingPerson.findById(req.params.id);

      if (!report) {
          //if report didnt exist
          return res.status(404).json({ success: false, error: 'Report not found.' });
      }

      if (report.reporterName !== reporterName) {
          //not the same reporter
          return res.status(403).json({ success: false, error: 'Reporter name does not match.' });
      }

      await MissingPerson.deleteOne({ _id: req.params.id });
      res.status(200).json({ success: true, message: 'Report deleted.' });
  } catch (err) {
      res.status(500).json({ success: false, error: err.message });
  }
});



//host the server
app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
