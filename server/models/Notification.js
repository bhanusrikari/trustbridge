
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_role: {
        type: DataTypes.ENUM('User', 'ServiceProvider', 'LocalResident', 'Admin'),
        defaultValue: 'User'
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('system', 'booking', 'forum', 'chat', 'review', 'like', 'comment'),
        defaultValue: 'system'
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    related_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    related_role: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'notifications',
    timestamps: true
});

module.exports = Notification;
