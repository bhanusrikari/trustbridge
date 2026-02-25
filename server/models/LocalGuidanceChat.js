const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LocalGuidanceChat = sequelize.define('LocalGuidanceChat', {
    chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    lrid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sender_type: {
        type: DataTypes.ENUM('User', 'LocalResident'),
        allowNull: false
    }
}, {
    tableName: 'local_guidance_chat',
    timestamps: true
});

module.exports = LocalGuidanceChat;
