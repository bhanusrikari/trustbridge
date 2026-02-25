const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Complaint = sequelize.define('Complaint', {
    complaint_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reported_type: {
        type: DataTypes.ENUM('ServiceProvider', 'LocalResident', 'Review'),
        allowNull: false
    },
    reported_id: {
        type: DataTypes.INTEGER,
        allowNull: false
        // ID of the SP, LR, or Review being reported
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Open', 'In Review', 'Resolved'),
        defaultValue: 'Open'
    }
}, {
    tableName: 'complaints',
    timestamps: true
});

module.exports = Complaint;
