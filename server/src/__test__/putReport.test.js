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


describe('PUT /api/reports/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    
    test('should update successfully when reporter name match', async() => {
        const mockReport = {
            _id: 'mocked-id',
            reporterName: 'Test Reporter',
            locationOfMissingPerson: 'Old Location',
            lat: 10.1234,
            lng: 20.5678
        }

        MissingPerson.findById.mockResolvedValue(mockReport);
        MissingPerson.findByIdAndUpdate.mockResolvedValue({
            ...mockReport,
            locationOfMissingPerson: 'New Location',
            lat: 16.8409,
            lng: 96.1735
        });

        const updateData = {
            reporterName: 'Test Reporter',
            locationOfMissingPerson: 'New Location'
        };

        const response = await request(app)
            .put('/api/reports/mocked-id')
            .send(updateData)

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toMatchObject({
            locationOfMissingPerson: 'New Location',
            lat: 16.8409,
            lng: 96.1735
        })
        expect(MissingPerson.findByIdAndUpdate).toHaveBeenCalledWith(
            'mocked-id',
            {
              locationOfMissingPerson: 'New Location',
              lat: 16.8409,
              lng: 96.1735
            },
            { new: true, runValidators: true }
        );
    })

    test('should return 400 if reporterName is missing', async () => {
        const updateData = {
          locationOfMissingPerson: 'New Location'
        };
    
        const response = await request(app).put('/api/reports/mocked-id').send(updateData);
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Reporter name is required to edit.');
    });
    test('should return 404 if the report does not exist', async () => {
        MissingPerson.findById.mockResolvedValue(null);
    
        const updateData = {
          reporterName: 'Test Reporter',
          locationOfMissingPerson: 'New Location'
        };
    
        const response = await request(app).put('/api/reports/mocked-id').send(updateData);
    
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Report not found.');
    });

    test('should return 403 if reporterName does not match', async () => {
        const mockReport = {
          _id: 'mocked-id',
          reporterName: 'Different Reporter',
          locationOfMissingPerson: 'Old Location',
          lat: 10.1234,
          lng: 20.5678
        };
    
        MissingPerson.findById.mockResolvedValue(mockReport);
    
        const updateData = {
          reporterName: 'Test Reporter',
          locationOfMissingPerson: 'New Location'
        };
    
        const response = await request(app).put('/api/reports/mocked-id').send(updateData);
    
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'Reporter name does not match.');
    });

    test('should update without geocoding if locationOfMissingPerson is not changed', async () => {
        const mockReport = {
          _id: 'mocked-id',
          reporterName: 'Test Reporter',
          locationOfMissingPerson: 'Old Location',
          lat: 10.1234,
          lng: 20.5678
        };
    
        MissingPerson.findById.mockResolvedValue(mockReport);
        MissingPerson.findByIdAndUpdate.mockResolvedValue({
          ...mockReport,
          reporterName: 'Test Reporter'
        });
    
        const updateData = {
            reporterName: 'Test Reporter', // Used for validation only
            someOtherField: 'Updated Value' // Example of another field to update
        };
    
        const response = await request(app)
            .put('/api/reports/mocked-id')
            .send(updateData);
    
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toMatchObject({
          reporterName: 'Test Reporter',
          locationOfMissingPerson: 'Old Location',
          lat: 10.1234,
          lng: 20.5678
        });
        expect(MissingPerson.findById).toHaveBeenCalledWith('mocked-id');
        expect(MissingPerson.findByIdAndUpdate).toHaveBeenCalledWith(
            'mocked-id',
            { someOtherField: 'Updated Value' }, 
            { new: true, runValidators: true }
        );
    });
})
