const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/auth');
const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');

//Get all events
router.get('/', getAllEvents);

//Get event by id
router.get('/:id', getEventById);

//Create event
router.post('/', protect, admin, createEvent);

//Update event
router.put('/:id', protect, admin, updateEvent);

//Delete event
router.delete('/:id', protect, admin, deleteEvent);


module.exports = router;