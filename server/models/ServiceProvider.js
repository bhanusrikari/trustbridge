const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ServiceProvider = sequelize.define('ServiceProvider', {
    spid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    profile_pic: {
        type: DataTypes.STRING,
        allowNull: true
    },
    documents: {
        type: DataTypes.TEXT, // Store as JSON string or comma-separated URLs
        allowNull: true
    },
    cat_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'service_provider',
    timestamps: true
});

module.exports = ServiceProvider;
