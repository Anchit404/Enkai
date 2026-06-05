const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Bookings');

dotenv.config();

// 👤 USERS (Indian + realistic)
const users = [
    { name: 'Admin Enkai', email: 'admin@enkai.com', password: 'password123', role: 'admin' },
    { name: 'Rahul Sharma', email: 'rahul@gmail.com', password: 'password123', role: 'user' },
    { name: 'Priya Verma', email: 'priya@gmail.com', password: 'password123', role: 'user' },
    { name: 'Amit Patel', email: 'amit@gmail.com', password: 'password123', role: 'user' },
    { name: 'Sneha Kapoor', email: 'sneha@gmail.com', password: 'password123', role: 'user' },
    { name: 'Arjun Mehta', email: 'arjun@gmail.com', password: 'password123', role: 'user' },
    { name: 'Neha Singh', email: 'neha@gmail.com', password: 'password123', role: 'user' },
    { name: 'Rohit Gupta', email: 'rohit@gmail.com', password: 'password123', role: 'user' },
    { name: 'Karan Malhotra', email: 'karan@gmail.com', password: 'password123', role: 'user' },
    { name: 'Ananya Iyer', email: 'ananya@gmail.com', password: 'password123', role: 'user' }
];

// 🎉 EVENTS (Indian + high quality)
const events = [
    {
        name: "Zakir Khan Live - Standup Special",
        description: "A night full of laughter with Zakir Khan performing his latest standup.",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: "Kamani Auditorium, Delhi",
        category: "Comedy",
        totalSeats: 300,
        ticketPrice: 799,
        imageUrl: "https://images.unsplash.com/photo-1603190287605-e6ade32fa852?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Bangalore Tech Meetup",
        description: "Meet developers, founders, and discuss AI, startups, and web technologies.",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: "Koramangala, Bangalore",
        category: "Technology",
        totalSeats: 150,
        ticketPrice: 0,
        imageUrl: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Startup Networking Night",
        description: "Connect with founders and investors in a high-energy networking event.",
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        location: "WeWork BKC, Mumbai",
        category: "Business",
        totalSeats: 120,
        ticketPrice: 499,
        imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Sunburn Goa Festival",
        description: "India’s biggest EDM festival with international DJs and insane vibes.",
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: "Goa Beach",
        category: "Music",
        totalSeats: 1000,
        ticketPrice: 2500,
        imageUrl: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Delhi University Fest",
        description: "Music, dance, competitions and fun at DU fest.",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        location: "Delhi University",
        category: "College Fest",
        totalSeats: 800,
        ticketPrice: 199,
        imageUrl: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Hyderabad Pitch Day",
        description: "Startups pitch to top investors and VCs.",
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: "T-Hub Hyderabad",
        category: "Business",
        totalSeats: 200,
        ticketPrice: 299,
        imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Open Mic Comedy Night",
        description: "Watch upcoming comedians perform live.",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        location: "Indiranagar, Bangalore",
        category: "Comedy",
        totalSeats: 80,
        ticketPrice: 199,
        imageUrl: "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Product Management Workshop",
        description: "Learn PM skills from industry experts.",
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        location: "Gurgaon",
        category: "Technology",
        totalSeats: 100,
        ticketPrice: 999,
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "Bollywood Night Party",
        description: "Dance all night to Bollywood beats.",
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        location: "Delhi Club",
        category: "Party",
        totalSeats: 250,
        ticketPrice: 1200,
        imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800"
    },
    {
        name: "AI Conference India",
        description: "Explore future of AI with industry leaders.",
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        location: "Mumbai Convention Center",
        category: "Technology",
        totalSeats: 400,
        ticketPrice: 1500,
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/enkai');
        console.log('✅ MongoDB Connected');

        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();
        console.log('🗑️ Old data cleared');

        const salt = await bcrypt.genSalt(10);

        const hashedUsers = users.map(user => ({
            ...user,
            password: bcrypt.hashSync(user.password, salt),
            isVerified: true
        }));

        const createdUsers = await User.insertMany(hashedUsers);

        const adminUser = createdUsers.find(u => u.role === 'admin');
        const normalUsers = createdUsers.filter(u => u.role === 'user');

        console.log(`👤 ${createdUsers.length} users created`);

        const eventsWithAdmin = events.map(event => ({
            ...event,
            availableSeats: event.totalSeats,
            createdBy: adminUser._id
        }));

        console.log('DEBUG - First event before insert:', JSON.stringify(eventsWithAdmin[0], null, 2));

        const createdEvents = await Event.insertMany(eventsWithAdmin);
        console.log(`🎉 ${createdEvents.length} events created`);
        console.log('DEBUG - First event after insert:', JSON.stringify(createdEvents[0], null, 2));

        const bookingsData = [];

        for (const event of createdEvents) {
            const randomCount = Math.floor(Math.random() * 4) + 3;

            const shuffledUsers = [...normalUsers].sort(() => 0.5 - Math.random());
            const selectedUsers = shuffledUsers.slice(0, randomCount);

            for (const user of selectedUsers) {
                const statuses = ['pending', 'confirmed', 'cancelled'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                let paymentStatus = 'unpaid';

                if (status === 'confirmed' && event.ticketPrice > 0) {
                    paymentStatus = Math.random() > 0.1 ? 'paid' : 'unpaid';
                } else if (event.ticketPrice === 0) {
                    paymentStatus = 'paid';
                }

                bookingsData.push({
                    userId: user._id,
                    eventId: event._id,
                    status,
                    paymentStatus,
                    amount: event.ticketPrice
                });

                if (status === 'confirmed') {
                    event.availableSeats -= 1;
                    await event.save();
                }
            }
        }

        await Booking.insertMany(bookingsData);
        console.log(`🎫 ${bookingsData.length} bookings created`);

        console.log('\n🚀 SEEDING DONE');
        console.log('Admin: admin@enkai.com');
        console.log('Password: password123\n');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDatabase();