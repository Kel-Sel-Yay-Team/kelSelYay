// import fs from 'fs/promises';
// import fetch from 'node-fetch';
// import path from 'path';
// import dotenv from 'dotenv';

// dotenv.config(); // Loads .env for GOOGLE_MAPS_API_KEY

// const API_KEY = ''; 
// const INPUT_FILE = './input.json';
// const OUTPUT_FILE = './output.json';

// // Geocode location using Google Maps API
// async function geocodeLocation(location) {
//   const query = encodeURIComponent(location + ', Myanmar');
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&region=MM&key=${API_KEY}`;

//   try {
//     const res = await fetch(url);
//     const json = await res.json();

//     if (json.results && json.results.length > 0) {
//       const { lat, lng } = json.results[0].geometry.location;
//       console.log(`✅ Geocoded "${location}" → (${lat}, ${lng})`);
//       return { lat, lng };
//     } else {
//       console.warn(`⚠️ No geocode results for "${location}" — Status: ${json.status}`);
//       return { lat: 0.0, lng: 0.0 };
//     }
//   } catch (error) {
//     console.error(`❌ Error geocoding "${location}":`, error.message);
//     return { lat: 0.0, lng: 0.0 };
//   }
// }

// // Main function to read, process, and write updated JSON
// async function updateJsonFile() {
//   try {
//     const fileData = await fs.readFile(INPUT_FILE, 'utf8');
//     const missingPersons = JSON.parse(fileData);

//     for (let person of missingPersons) {
//       const { locationOfMissingPerson } = person;
//       const coords = await geocodeLocation(locationOfMissingPerson);
//       person.lat = coords.lat;
//       person.lng = coords.lng;

//       // Respect rate limit to avoid Google API quota issues
//       await new Promise(resolve => setTimeout(resolve, 250)); // 250ms delay
//     }

//     await fs.writeFile(OUTPUT_FILE, JSON.stringify(missingPersons, null, 2), 'utf8');
//     console.log(`🚀 Done! Updated file saved to: ${OUTPUT_FILE}`);
//   } catch (err) {
//     console.error('❌ Failed to process file:', err.message);
//   }
// }

// updateJsonFile();

import fs from 'fs/promises';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const INPUT_FILE = './missingPeopleBatch.json'; // Your updated JSON file
const API_URL = 'http://localhost:3002/api/reports/batch'; // Adjust this to your backend route

async function uploadReports() {
  try {
    const fileData = await fs.readFile(INPUT_FILE, 'utf8');
    const reports = JSON.parse(fileData);

    for (const report of reports) {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(`❌ Failed to upload: ${report.missingPersonName || 'Unknown Name'}`);
        console.error(result);
      }

      // Wait between requests (optional but helps avoid server overload)
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // console.log('🚀 All reports uploaded!');
  } catch (err) {
    console.error('❌ Error uploading reports:', err.message);
  }
}

uploadReports();
