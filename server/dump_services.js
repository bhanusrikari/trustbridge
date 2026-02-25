const { Service } = require('./models');

async function dumpServices() {
    try {
        const services = await Service.findAll({ raw: true });
        console.log("Dumping Services Table:");
        console.table(services);
        process.exit(0);
    } catch (error) {
        console.error("Dump failed:", error);
        process.exit(1);
    }
}

dumpServices();
