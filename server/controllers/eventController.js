const Event = require('../models/Event');


//Get all events

exports.getAllEvents = async (req, res) => {
    try {

        const filters ={};
        if (req.query.category){
            filters.category = req.query.category;
        }
        if (req.query.ticketPrice){
            filters.ticketPrice = req.query.ticketPrice;
        }

        const events = await Event.find(filters);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//Get event by id
exports.getEventById = async (req, res) => {
    try{
        const event  = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Create event
exports.createEvent = async(req, res) => {
    const { name, description, date, location, category, ticketPrice, imageUrl, totalSeats } = req.body;
    try{
        const event = new Event ({ 
            name, description, date, location, category, ticketPrice, imageUrl, totalSeats, 
            availableSeats: totalSeats,
            createdBy: req.user._id 
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Update event

exports.updateEvent = async(req, res) =>{
    const { name, description, date, location, category, ticketPrice, imageUrl, totalSeats } = req.body;
    try{
        const event = await Event.findById(req.params.id);
        if(!event){
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is the creator of the event
        if(event.createdBy.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { 
            name, description, date, location, category, ticketPrice, imageUrl, totalSeats }, { new: true });
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Delete event

exports.deleteEvent = async(req, res) => {
    try{
        const event = await Event.findById(req.params.id);
        if(!event){
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is the creator of the event
        if(event.createdBy.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
