const axios = require('axios');

async function testApi() {
    try {
        // First get all services to find a valid ID
        const servicesRes = await axios.get('http://localhost:5000/api/services');
        const services = servicesRes.data;

        if (services.length === 0) {
            console.log("No services found in database.");
            return;
        }

        const id = services[0].service_id;
        console.log(`Testing with service_id: ${id}`);

        const serviceRes = await axios.get(`http://localhost:5000/api/services/${id}`);
        console.log("Service Details Response:", JSON.stringify(serviceRes.data, null, 2));
    } catch (error) {
        console.error("API Test Failed:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testApi();
