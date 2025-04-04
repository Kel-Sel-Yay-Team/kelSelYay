const request = require('supertest');
const express = require('express');
const MissingPerson = require('../models/MissingPerson.js');
const missingPersonRoutes = require('../routes/handleMissingPerson.js');
const { mockReports } = require('./mockData.js');

jest.mock('../models/MissingPerson.js');

const app = express();
app.use(express.json());
app.use('/api/reports', missingPersonRoutes);

describe('GET /api/reports', () => {
  test('should return all reports as a list of MissingPerson schema', async () => {
    MissingPerson.find.mockResolvedValue(mockReports);

    const response = await request(app).get('/api/reports');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReports);
    expect(MissingPerson.find).toHaveBeenCalledTimes(1);
    expect(MissingPerson.find).toHaveBeenCalledWith();
  });
});