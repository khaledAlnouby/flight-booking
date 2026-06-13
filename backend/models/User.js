import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Company', 'Passenger'],
    required: true
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tel: { type: String, required: true },
  accountBalance: { type: Number, default: 0 },
  
  // Company Specific Fields
  bio: { type: String },
  address: { type: String },
  location: { type: String },
  username: { type: String },
  logoImg: { type: String },
  
  // Passenger Specific Fields
  photo: { type: String },
  passportImg: { type: String },
  
  // Relations
  flights: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flight' }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
