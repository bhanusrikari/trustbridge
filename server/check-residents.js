const { LocalResident, sequelize } = require('./models');
sequelize.options.logging = false;

const checkResidents = async () => {
    try {
        const residents = await LocalResident.findAll();
        let output = `Found ${residents.length} LocalResidents\n`;
        residents.forEach(r => {
            output += `ID: ${r.lrid}, Email: ${JSON.stringify(r.email)}, Name: ${r.fname} ${r.lname}, Pass: ${r.password ? 'EXISTS' : 'MISSING'}\n`;
        });
        const fs = require('fs');
        fs.writeFileSync('resident_check.txt', output);
        console.log('Results written to resident_check.txt');
        process.exit(0);
    } catch (error) {
        console.error('Error fetching residents:', error);
        process.exit(1);
    }
};

checkResidents();
