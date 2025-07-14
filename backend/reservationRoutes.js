/*
    http://localhost:3000/reservations -> retrieve all reservations
    http://localhost:3000/reservations/register -> regitser a reservation 
    base route + backend route -> 1 function each only -> returns res to front end
*/

const Reservation = require('./models/Reservations');
const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;

let reservationRoutes = express.Router() // express router object

// retrieve all 
reservationRoutes.route("/reservations").get(async (req, res) => { // req from front end, res is from back end
    try {
    const { labId, userId, startDate, endDate } = req.query;
    const filter = {};
    
    if (labId) filter.lab = labId;
    if (userId) filter.user = userId;
    
    // Date range filter
    if (startDate && endDate) {
      filter.startTime = { $gte: new Date(startDate) };
      filter.endTime = { $lte: new Date(endDate) };
    }
    
    // Students can only see their own reservations
    if (req.user.role === 'Student') {
      filter.user = req.user.id;
    }

    const reservations = await Reservation.find(filter)
      .populate('lab', 'name location')
      .populate('user', 'name email')
      .populate('reservedBy', 'name email');
      
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}) // returns mongo cursor in array

// retrieve one
reservationRoutes.route("/reservations/:id").get(async (req, res) => { // req from front end, res is from back end
    let db = database.getDb() // connects to data base
    let data = await db.collection("reservations").findOne({_id: new ObjectId(req.params.id)})
    if (Object.keys(data).length > 0) {
        res.json(data)
    } else {
        throw new Error("Data was not found.")
    }
}) // return direct object

// create reservation
reservationRoutes.route("/reservations").post(async (req, res) => {
    try {
    const { labId, startTime, endTime, status, userId } = req.body;
    
    // If technician is reserving for a student
    const reservedFor = req.user.role === 'Admin' && userId ? userId : req.user.id;
    
    const reservation = new Reservation({
      lab: labId,
      user: reservedFor,
      reservedBy: req.user.role === 'Admin' ? req.user.id : null,
      startTime,
      endTime,
      status
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

// update reservation
reservationRoutes.route("/reservations/:id").put(async (req, res) => { // req from front end, res is from back end
    try {
    const { id } = req.params;
    const updates = req.body;
    
    const reservation = await Reservation.findById(id);
    
    // Check permissions
    if (req.user.role === 'Student' && reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this reservation' });
    }
    
    // Prevent updating certain fields for students
    if (req.user.role === 'Student') {
      delete updates.status; // Students can't change status
      delete updates.user;  // Students can't change who it's for
    }
    
    const updatedReservation = await Reservation.findByIdAndUpdate(id, updates, { new: true });
    res.json(updatedReservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

// delete reservation
reservationRoutes.route("/reservations/:id").delete(async (request, response) => { // request from front end, response is from back end
    try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    
    // Check permissions
    if (req.user.role === 'Student' && reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this reservation' });
    }
    
    await reservation.remove();
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Check availability for time slot
reservationRoutes.route("/reservations/availability").post(async (req, res) => {
    try {
    const { labId, startTime, endTime } = req.query;
    
    const conflictingReservations = await Reservation.find({
      lab: labId,
      $or: [
        { startTime: { $lt: new Date(endTime) }, endTime: { $gt: new Date(startTime) } },
        { startTime: { $gte: new Date(startTime), $lt: new Date(endTime) } },
        { endTime: { $gt: new Date(startTime), $lte: new Date(endTime) } }
      ],
      status: { $ne: 'cancelled' }
    });
    
    res.json({
      isAvailable: conflictingReservations.length === 0,
      conflictingReservations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = reservationRoutes