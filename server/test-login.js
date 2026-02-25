const http = require('http');

const data = JSON.stringify({
    email: 'bhavya@gmail.com',
    password: 'password123',
    role: 'LocalResident'
});

const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => { responseBody += chunk; });
    res.on('end', () => {
        console.log('Status code:', res.statusCode);
        console.log('Response body:', responseBody);
    });
});

req.on('error', (error) => {
    console.error('Request error:', error);
});

req.write(data);
req.end();
