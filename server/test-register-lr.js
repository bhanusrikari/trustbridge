const http = require('http');

const data = JSON.stringify({
    role: 'LocalResident',
    email: 'lr_test@example.com',
    password: 'password123',
    fname: 'Local',
    lname: 'Resident',
    city: 'Hyderabad',
    area: 'Madhapur',
    phone_number: '1234567891'
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
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => console.log('Response:', body));
});

req.write(data);
req.end();
