const http = require('http');

const data = JSON.stringify({
    role: 'ServiceProvider',
    email: 'sp_test@example.com',
    password: 'password123',
    sname: 'Test SP',
    phone: '1234567892',
    address: 'Hitech City',
    cat_id: 1, // Assumes category 1 exists
    description: 'Test description',
    documents: 'http://test.com/doc.pdf'
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
