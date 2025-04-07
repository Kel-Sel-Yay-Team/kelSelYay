/*

 // FIX LOCATION COORDINATES for Sky Villa
 router.put('/fixSkyVilla', async (req, res) => {
  try {
    const oldLat = 22.0001933;
    const oldLng = 96.09440029999999;

    const newLat = 21.985738;
    const newLng = 96.116109;

    // Find all matching documents
    const reportsToUpdate = await MissingPerson.find({ lat: oldLat, lng: oldLng });

    if (reportsToUpdate.length === 0) {
      return res.status(404).json({ success: false, message: 'No reports found with the old coordinates.' });
    }

    // Update each document
    const updatePromises = reportsToUpdate.map(report => {
      report.lat = newLat;
      report.lng = newLng;
      return report.save();
    });

    const updatedReports = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: `${updatedReports.length} report(s) updated successfully.`,
      updatedReports,
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
  

*/