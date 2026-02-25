const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CommunityForum = sequelize.define('CommunityForum', {
    post_id: {
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
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'community_forum',
    timestamps: true
});

module.exports = CommunityForum;
