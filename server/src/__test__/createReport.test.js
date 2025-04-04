const request = require('supertest');
const express = require('express');
const MissingPerson = require('../models/MissingPerson.js');
const missingPersonRoutes = require('../routes/handleMissingPerson.js');
const { validRequestData } = require('./mockData.js');

jest.mock('../models/MissingPerson.js');
jest.mock('../services/googleMapService.js', () => {
  return jest.fn().mockImplementation(() => ({
    getLatLng: jest.fn().mockResolvedValue({
      lat: 16.8409,
      lng: 96.1735
    })
  }));
});

const app = express();
app.use(express.json());
app.use('/api/reports', missingPersonRoutes);

describe('POST /api/reports', () => {
  test('should create a new missing person report successfully', async () => {
    const mockSave = jest.fn().mockResolvedValue({
      ...validRequestData,
      lat: 16.8409,
      lng: 96.1735
    });

    MissingPerson.mockImplementationOnce(() => ({
      save: mockSave
    }));

    const response = await request(app).post('/api/reports').send(validRequestData);

    expect(response.status).toBe(201);
    expect(MissingPerson).toHaveBeenCalledWith({
      ...validRequestData,
      lat: 16.8409,
      lng: 96.1735
    });
    expect(mockSave).toHaveBeenCalled();
  });
});