const { sequelize } = require('../models');

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Sync all models
        // force: true will DROP TABLES if they exist. Use with caution.
        // alter: true will update tables.
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing database:', error);
        process.exit(1);
    }
};

syncDatabase();
