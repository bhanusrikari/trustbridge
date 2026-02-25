const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define('Review', {
    review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_spam: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    image: {
        type: DataTypes.TEXT, // Store image URL or base64
        allowNull: true
    }
}, {
    tableName: 'reviews',
    timestamps: true
});

module.exports = Review;
