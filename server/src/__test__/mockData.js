module.exports = {
    mockReports: [
      {
        _id: '1',
        missingPersonName: 'John Doe',
        reporterName: 'Jane Smith',
        found: false,
        locationOfMissingPerson: 'Yangon',
        lat: 16.8409,
        lng: 96.1735
      },
      {
        _id: '2',
        missingPersonName: 'Bob Jones',
        reporterName: 'Alice Wilson',
        found: true,
        locationOfMissingPerson: 'Mandalay',
        lat: 21.9588,
        lng: 96.0891
      }
    ],
    validRequestData: {
      missingPersonName: 'Test Person',
      reporterName: 'Test Reporter',
      phoneNumber: '123-456-7890',
      locationOfMissingPerson: 'Yangon, Myanmar',
      missingPersonDescription: 'Test description',
      relationshipToReporter: 'Best friend forever',
      timeSinceMissing: 5
    },
    invalidRequestData: {
      missingPersonName: 'Test Person',
      reporterName: 'Test Reporter'
    }
  };