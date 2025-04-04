const express = require('express');
const MissingPerson = require('../models/MissingPerson.js');
const GoogleMapService = require('../services/googleMapService.js');

const router = express.Router();
const googleMapService = new GoogleMapService();

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

//GET route with geocoding functionality (Google Maps version)
router.post('/', async (req, res) => {
    try {
        const { locationOfMissingPerson, ...rest } = req.body;

        // Frontend should have validated this, but double-check
        if (!locationOfMissingPerson) {
            return res.status(400).json({ error: "Location is required." });
        }

        //Step 1: Geocode using Google Maps API
        const query = encodeURIComponent(locationOfMissingPerson);
        const { lat, lng } = await googleMapService.getLatLng(query);

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
        const query = encodeURIComponent(locationOfMissingPerson);
        const { lat, lng } = await googleMapService.getLatLng(query);
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

module.exports = router;

