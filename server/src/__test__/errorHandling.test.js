const request = require('supertest');
const express = require('express');
const MissingPerson = require('../models/MissingPerson.js');
const missingPersonRoutes = require('../routes/handleMissingPerson.js');
const { invalidRequestData } = require('./mockData.js');

jest.mock('../services/googleMapService.js', () => {
  return jest.fn().mockImplementation(() => ({
    getLatLng: jest.fn().mockRejectedValue(new Error('Location could not be geocoded.'))
  }));
});


describe('Error Handling in /api/reports', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/api/reports', missingPersonRoutes);
  });

  test('should return 400 when locationOfMissingPerson is missing', async () => {
    const response = await request(app).post('/api/reports').send(invalidRequestData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Location is required.');
  });

  test('should handle Google Maps API errors', async () => {  
    const requestData = {
      missingPersonName: 'Test Person',
      reporterName: 'Test Reporter',
      locationOfMissingPerson: 'Invalid Location'
    };
  
    const response = await request(app).post('/api/reports').send(requestData);
  
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Location could not be geocoded.');
  });
});