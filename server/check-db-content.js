const { User, LocalResident, ServiceProvider, Admin } = require('./models');

const checkDB = async () => {
    try {
        const userCount = await User.count();
        const lrCount = await LocalResident.count();
        const spCount = await ServiceProvider.count();
        const adminCount = await Admin.count();

        console.log('User Count:', userCount);
        console.log('LocalResident Count:', lrCount);
        console.log('ServiceProvider Count:', spCount);
        console.log('Admin Count:', adminCount);

        const users = await User.findAll({ attributes: ['email'] });
        console.log('User Emails:', users.map(u => u.email));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDB();
