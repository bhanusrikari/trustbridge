const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Booking = sequelize.define('Booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    spid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    booking_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    booking_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'),
        defaultValue: 'Pending'
    }
}, {
    tableName: 'bookings',
    timestamps: true
});

module.exports = Booking;
