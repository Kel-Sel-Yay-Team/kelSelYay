const request = require('supertest');
const express = require('express');
const missingPersonRoutes = require('../routes/handleMissingPerson.js');
const MissingPerson = require('../models/MissingPerson.js');

const app = express();
app.use(express.json());
app.use('/api/reports', missingPersonRoutes);

jest.mock('../models/MissingPerson.js');

describe('DELETE /api/reports/:id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should respond with status code 200 when deletion is successful', async () => {
        const mockReport = {
            _id: 'mocked-id',
            reporterName: 'Test Reporter'
        };

        // Mock the database calls
        MissingPerson.findById.mockResolvedValue(mockReport);
        MissingPerson.deleteOne.mockResolvedValue({ deletedCount: 1 });

        const response = await request(app)
            .delete('/api/reports/mocked-id')
            .send({ reporterName: 'Test Reporter' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Report deleted.');
        expect(MissingPerson.findById).toHaveBeenCalledWith('mocked-id');
        expect(MissingPerson.deleteOne).toHaveBeenCalledWith({ _id: 'mocked-id' });
    });

    test('should return 400 if reporterName is missing', async () => {
        const response = await request(app)
            .delete('/api/reports/mocked-id')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Reporter name is required for deletion.');
    });

    test('should return 404 if the report does not exist', async () => {
        MissingPerson.findById.mockResolvedValue(null);

        const response = await request(app)
            .delete('/api/reports/mocked-id')
            .send({ reporterName: 'Test Reporter' });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Report not found.');
    });

    test('should return 403 if reporterName does not match', async () => {
        const mockReport = {
            _id: 'mocked-id',
            reporterName: 'Different Reporter'
        };

        MissingPerson.findById.mockResolvedValue(mockReport);

        const response = await request(app)
            .delete('/api/reports/mocked-id')
            .send({ reporterName: 'Test Reporter' });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'Reporter name does not match.');
    });
});