const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ForumComment = sequelize.define('ForumComment', {
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_role: {
        type: DataTypes.ENUM('User', 'ServiceProvider', 'LocalResident', 'Admin'),
        defaultValue: 'User'
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'forum_comments',
    timestamps: true
});

module.exports = ForumComment;
