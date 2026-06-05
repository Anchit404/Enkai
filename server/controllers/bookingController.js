const mongoose = require('mongoose');
const Booking = require('../models/Bookings');
const OTP = require('../models/OTP');
const Event = require('../models/Event');
const { sendOTPEmail, sendBookingEmail } = require('../utils/email');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


exports.sendBookingOtp = async(req,res) =>{
    try {
        console.log('DEBUG - sendBookingOtp - req.user:', req.user);
        console.log('DEBUG - sendBookingOtp - email:', req.user?.email);
        const otp = generateOTP();
        await OTP.findOneAndDelete({email: req.user.email, action: 'event_booking'});
        await OTP.create({
            email: req.user.email,
            otp: otp,
            action: 'event_booking',
        });
        await sendOTPEmail(req.user.email, otp, 'event_booking');
        res.json({ message: 'OTP sent successfully', email: req.user.email });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP: ' + error.message });
    }
}

exports.bookEvent = async(req,res) =>{
  try {
    console.log('Raw req.body:', req.body);
    console.log('req.user:', req.user);
    
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated - req.user is missing' });
    }
    
    const{eventId, otp} = req.body;
    const trimmedOtp = otp ? otp.trim() : '';
    console.log('Booking attempt:', { email: req.user.email, userId: req.user._id, otpReceived: otp, trimmedOtp, eventId });
    
    const allOtps = await OTP.find({email: req.user.email, action: 'event_booking'});
    console.log('Found OTPs for user:', allOtps.map(o => ({ otp: o.otp, createdAt: o.createdAt })));
    
    const otpRecord = await OTP.findOne({email: req.user.email, otp: trimmedOtp, action: 'event_booking'});
    console.log('OTP lookup result:', otpRecord);
    
    if(!otpRecord){
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    const event = await Event.findById(eventId);
    if(!event){
        return res.status(404).json({ message: 'Event not found' });
    }

    if(event.availableSeats <= 0){
        return res.status(400).json({ message: 'Event is full' });
    }

    const existingBooking = await Booking.findOne({userId: req.user._id, eventId: eventId});
    if(existingBooking){
        return res.status(400).json({ message: 'You have already booked this event' });
    }

    console.log('Creating booking with values:', { userId: req.user?._id, eventId, user: req.user });
    
    const booking = await Booking.create({
        userId: req.user._id,
        eventId: new mongoose.Types.ObjectId(eventId),
        amount: event.ticketPrice,
        status: 'pending',
        paymentStatus: 'unpaid'
    });

    await OTP.deleteMany({email: req.user.email, action: 'event_booking'});
    
    res.status(201).json({ message: 'Event booked successfully', booking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
}


exports.confirmBooking = async(req, res) => {
    const paymentStatus = req.body.paymentStatus;
    if(!['paid', 'pending'].includes(paymentStatus)){
        return res.status(400).json({ message: 'Invalid payment status' });
    }
    const booking = await Booking.findById(req.params.id).populate('eventId');
    if(!booking){
        return res.status(404).json({ message: 'Booking not found' });
    }

    if(booking.status === 'confirmed'){
        return res.status(400).json({ message: 'Booking already confirmed' });
    }

    const event = await Event.findById(booking.eventId._id);
    if(event.totalSeats<=0){
        return res.status(400).json({ message: 'Event is full' });
    }

    booking.status = 'confirmed';

    if(paymentStatus === 'paid'){
        booking.paymentStatus = paymentStatus;
    }
    await booking.save();
    event.totalSeats -= 1;
    await event.save();

    await sendBookingEmail(req.user.email, event.name, booking._id);
    res.json({ message: 'Booking confirmed successfully', booking });
}

exports.getMyBookings = async (req, res) => {
    const bookings = await Booking.find({userId:req.user._id}).populate('eventId');
    res.json(bookings);
}

exports.getAllBookings = async (req, res) => {
    try {
        // Check what fields events actually have
        const Event = require('../models/Event');
        const sampleEvent = await Event.findOne().lean();
        console.log('DEBUG - Sample event from DB (lean):', JSON.stringify(sampleEvent, null, 2));
        
        const bookings = await Booking.find()
            .populate({ path: 'eventId', options: { lean: true } })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        
        console.log('DEBUG - First booking after populate:', JSON.stringify(bookings[0], null, 2));
        
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
}

exports.cancelBooking = async(req, res) => {
    const booking = await Booking.findById(req.params.id);
   if(!booking){
    return res.status(404).json({ message: 'Booking not found' });
   }
   // Allow only booking owner or admin to cancel
   const isOwner = booking.userId.toString() === req.user._id.toString();
   const isAdmin = req.user.role === 'admin';
   if(!isOwner && !isAdmin){
    return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
   }

   // Restore seats if booking was confirmed
   if(booking.status === 'confirmed'){
    const event = await Event.findById(booking.eventId);
    if(event){
        event.availableSeats += 1;
        await event.save();
    }
   }

   booking.status = 'cancelled';
   await booking.save();

   res.json({ message: 'Booking cancelled successfully' });
}
