import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  name: { type: String, required: true },
  flightId: { type: String, required: true, unique: true },
  itinerary: [{ type: String }], // Array of cities
  fees: { type: Number, required: true },
  maxPassengers: { type: Number, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Schedule per city: { city: 'NYC', startTime: '...', endTime: '...' }
  time: [{
    city: String,
    startTime: Date,
    endTime: Date
  }],
  
  registeredPassengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pendingPassengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }
}, { timestamps: true });

export default mongoose.model('Flight', flightSchema);
