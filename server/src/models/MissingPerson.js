import mongoose from 'mongoose';

const MissingPersonSchema = new mongoose.Schema({
    reporterName : { type: String, required: true},
    missingPersonName: { type: String, required: true },
    phoneNumber: String,
    missingPersonDescription: String,
    relationshipToReporter: String,
    locationOfMissingPerson: {type : String,  required: true},// From input box, e.g. "23 street, Yangon, Myanmar"
    timeSinceMissing: Number, // in hours or days
    imageUrl: String, // image path or URL
    found: { type: Boolean, default: false },
  });

export default mongoose.models.MissingPerson ||
mongoose.model('MissingPerson', MissingPersonSchema);