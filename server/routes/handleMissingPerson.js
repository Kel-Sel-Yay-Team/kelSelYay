import express from 'express';
import MissingPerson from '../src/models/MissingPerson.js';

const router = express.Router();

//CRUD

router.post('/', async (req, res) => {
  try {
    const report = new MissingPerson(req.body);

    const saved = await report.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
