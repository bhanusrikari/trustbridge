const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ufname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ulname: {
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
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    profile_pic: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User;
