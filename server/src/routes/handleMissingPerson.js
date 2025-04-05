import express from 'express';
import MissingPerson from '../models/MissingPerson.js';

const router = express.Router();

//CRUD
//GET everyone from the database
router.get('/', async(req, res) => {

    try {
        const reports = await MissingPerson.find();

        res.status(200).json(reports);
        
    } catch(e) {
        res.status(500).json({ error : e.message });
    }
});

//GET, not-found people (for rendering on mapbox)
router.get('/notfound', async (req, res) => {
  try {
      const reports = await MissingPerson.find({ found: false });
      res.status(200).json(reports);
  } catch (e) {
      res.status(500).json({ error: e.message });
  }
});
// GET, check if a report already exists with given lat & lng
router.get('/coordexists', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng are required as query parameters.' });
    }

    const exists = await MissingPerson.exists({
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    });

    res.status(200).json({ exists: !!exists });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//POST route with geocoding functionality (Google Maps version)
router.post('/', async (req, res) => {
    try {
        const { locationOfMissingPerson, ...rest } = req.body;

        // Frontend should have validated this, but double-check
        if (!locationOfMissingPerson) {
            return res.status(400).json({ error: "Location is required." });
        }

        //Step 1: Geocode using Google Maps API
        const query = encodeURIComponent(locationOfMissingPerson);
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&region=MM&key=${apiKey}`;
        
        const geoRes = await fetch(url);
        const geoData = await geoRes.json();

        if (!geoData.results || !geoData.results.length) {
            return res.status(404).json({ error: "Location could not be geocoded." });
        }

        const { lat, lng } = geoData.results[0].geometry.location;

        // Step 2: Store full report with lat/lng
        const report = new MissingPerson({
            ...rest,
            locationOfMissingPerson,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
        });

        const saved = await report.save();
        res.status(201).json(saved);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// POST a single missing person report (no geocoding)
router.post('/batch', async (req, res) => {
  try {
    const report = new MissingPerson(req.body);
    const saved = await report.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error saving missing person report:', err.message);
    res.status(500).json({ error: err.message });
  }
});

//EDIT (with reporterName validation)
router.put("/:id", async (req, res) => {
    try {
      const { reporterName, locationOfMissingPerson, ...updateData } = req.body;
  
      if (!reporterName) {
        return res.status(400).json({ success: false, error: "Reporter name is required to edit." });
      }
  
      // step 1: Find the report
      const report = await MissingPerson.findById(req.params.id);
  
      if (!report) {
        return res.status(404).json({ success: false, error: "Report not found." });
      }
  
      // step 2: Verify reporterName
      if (report.reporterName !== reporterName) {
        return res.status(403).json({ success: false, error: "Reporter name does not match." });
      }
  
      // step 3: If location changed, re-geocode it
      if (locationOfMissingPerson && locationOfMissingPerson !== report.locationOfMissingPerson) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
          return res.status(500).json({ success: false, error: "Missing Google Maps API key" });
        }

        const query = encodeURIComponent(locationOfMissingPerson);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&region=MM&key=${apiKey}`;

        const geoRes = await fetch(url);
        const geoData = await geoRes.json();

        if (!geoData.results || !geoData.results.length) {
            return res.status(404).json({ success: false, error: "Location could not be geocoded." });
        }

        const { lat, lng } = geoData.results[0].geometry.location;
        updateData.lat = parseFloat(lat);
        updateData.lng = parseFloat(lng);
        updateData.locationOfMissingPerson = locationOfMissingPerson;
      }
  
      // step 4: Proceed with update
      const updatedReport = await MissingPerson.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
  
      res.status(200).json({ success: true, data: updatedReport });
  
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
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
