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

//input: reporterName, the id of the request
router.delete('/:id', async (req, res) => {
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

export default router;
