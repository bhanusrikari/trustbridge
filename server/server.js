const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config();

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/review');
const locationRoutes = require('./routes/location');
const forumRoutes = require('./routes/forum');

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/resident', require('./routes/resident'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/upload', require('./routes/upload'));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('TrustBridge API is running');
});

const { sequelize } = require('./models');

// Authenticate and start server
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to database:', err);
    });

process.on('exit', (code) => {
    console.log(`Process exiting with code: ${code}`);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT');
    process.exit();
});

setInterval(() => {
    // Keep process alive
}, 1000);
