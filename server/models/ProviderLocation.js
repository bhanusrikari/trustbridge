const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProviderLocation = sequelize.define('ProviderLocation', {
    loc_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    spid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    }
}, {
    tableName: 'provider_location',
    timestamps: true
    // Schema says updatedAt, sequelize adds createdAt and updatedAt by default.
});

module.exports = ProviderLocation;
