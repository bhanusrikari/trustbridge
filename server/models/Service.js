const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Service = sequelize.define('Service', {
    service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    service_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cat_id: {
        type: DataTypes.INTEGER,
        allowNull: false
        // FK will be defined in associations
    },
    spid: {
        type: DataTypes.INTEGER,
        allowNull: false
        // FK to ServiceProvider
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_bookable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'services',
    timestamps: false
});

module.exports = Service;
