
const http = require('http');

const data = JSON.stringify({
    role: 'User',
    email: 'testuser_debug_bad@example.com',
    password: 'password123',
    // ufname: 'Test', // Missing required field
    ulname: 'User',
    phone_number: '1234567890',
    address: '123 Test St'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Response:', body);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
