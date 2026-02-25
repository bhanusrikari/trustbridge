const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Message = sequelize.define('Message', {
    msg_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sender_role: {
        type: DataTypes.ENUM('User', 'ServiceProvider', 'LocalResident', 'Admin'),
        allowNull: false
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    receiver_role: {
        type: DataTypes.ENUM('User', 'ServiceProvider', 'LocalResident', 'Admin'),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'messages',
    timestamps: true
});

module.exports = Message;
