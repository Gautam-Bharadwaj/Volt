const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
});

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    level: { type: DataTypes.INTEGER, defaultValue: 1 },
    rank: { type: DataTypes.STRING, defaultValue: 'ROOKIE' },
    xp: { type: DataTypes.INTEGER, defaultValue: 0 },
    maxXp: { type: DataTypes.INTEGER, defaultValue: 1000 },
    fitnessScore: { type: DataTypes.INTEGER, defaultValue: 0 },
    calories: { type: DataTypes.INTEGER, defaultValue: 0 },
    streak: { type: DataTypes.INTEGER, defaultValue: 0 },
    steps: { type: DataTypes.INTEGER, defaultValue: 0 },
    lastLogin: { type: DataTypes.DATE, allowNull: true }
});

module.exports = { sequelize, User };
