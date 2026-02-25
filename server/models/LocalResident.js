const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LocalResident = sequelize.define('LocalResident', {
    lrid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lname: {
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
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    residence_status: {
        type: DataTypes.ENUM('Pending', 'Verified', 'Rejected'),
        defaultValue: 'Pending'
    },
    badge: {
        type: DataTypes.STRING,
        defaultValue: 'None'
    },
    trust_rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    }
}, {
    tableName: 'local_resident',
    timestamps: true
});

module.exports = LocalResident;
