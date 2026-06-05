const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middlewares/auth');
const { bookEvent, getMyBookings, getAllBookings, confirmBooking, cancelBooking, sendBookingOtp } = require('../controllers/bookingController');


router.post('/', protect, bookEvent)    
router.post('/send-otp', protect, sendBookingOtp)
router.get('/my', protect, getMyBookings)
router.get('/all', protect, admin, getAllBookings)
router.put('/:id/confirm', protect, admin, confirmBooking)
router.delete('/:id', protect, cancelBooking)

module.exports = router;
