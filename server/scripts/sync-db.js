const { sequelize } = require('../models');

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        // Using alter true to preserve data while updating schema
        await sequelize.sync({ alter: true });
        console.log('Database synced with alter: true.');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
};

syncDatabase();
