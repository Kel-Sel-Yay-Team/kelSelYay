export async function geocodeLocation(location) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
    if (!location) {
      throw new Error("No location provided.");
    }
  
    if (!apiKey) {
      throw new Error("Missing Google Maps API key.");
    }
  
    const query = encodeURIComponent(location);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&region=MM&key=${apiKey}`;
  
    const geoRes = await fetch(url);
    const geoData = await geoRes.json();
  
    if (!geoData.results || !geoData.results.length) {
      throw new Error("Location could not be geocoded.");
    }
  
    const { lat, lng } = geoData.results[0].geometry.location;
    return { lat: parseFloat(lat), lng: parseFloat(lng) };
}
  