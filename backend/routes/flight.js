import express from 'express';
import Flight from '../models/Flight.js';
import User from '../models/User.js';
import { protect, companyOnly, passengerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/flights
// @desc    Create a flight (Company only)
router.post('/', protect, companyOnly, async (req, res) => {
  try {
    const flight = await Flight.create({
      ...req.body,
      company: req.user.id
    });

    // Add flight to company's flights array
    await User.findByIdAndUpdate(req.user.id, { $push: { flights: flight._id } });

    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/flights
// @desc    Get all flights
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.find().populate('company', 'name logoImg location');
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/flights/:id
// @desc    Get single flight by ID
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id)
      .populate('company', 'name logoImg location')
      .populate('registeredPassengers', 'name email photo')
      .populate('pendingPassengers', 'name email photo');
      
    if (flight) {
      res.json(flight);
    } else {
      res.status(404).json({ message: 'Flight not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/flights/:id/book
// @desc    Book a flight (Passenger only)
router.post('/:id/book', protect, passengerOnly, async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    const passenger = await User.findById(req.user.id);

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.registeredPassengers.length >= flight.maxPassengers) {
      return res.status(400).json({ message: 'Flight is full' });
    }

    if (passenger.accountBalance < flight.fees) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Deduct fees and add to flight
    passenger.accountBalance -= flight.fees;
    passenger.flights.push(flight._id);
    await passenger.save();

    // Add passenger to flight registered list
    flight.registeredPassengers.push(passenger._id);
    await flight.save();
    
    // Add funds to company account
    const company = await User.findById(flight.company);
    company.accountBalance += flight.fees;
    await company.save();

    res.json({ message: 'Flight booked successfully', flight });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/flights/:id/cancel
// @desc    Cancel a flight (Company only)
router.post('/:id/cancel', protect, companyOnly, async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.company.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to cancel this flight' });
    }

    // Refund all registered passengers
    for (const passId of flight.registeredPassengers) {
      const passenger = await User.findById(passId);
      if (passenger) {
        passenger.accountBalance += flight.fees;
        await passenger.save();
      }
    }
    
    // Deduct from company
    const company = await User.findById(req.user.id);
    company.accountBalance -= (flight.fees * flight.registeredPassengers.length);
    await company.save();

    flight.status = 'Cancelled';
    await flight.save();

    res.json({ message: 'Flight cancelled and refunds processed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
