const http = require('http');

const testCases = [
    { email: 'testuser_debug_4@example.com', password: 'password123', role: 'User' },
    { email: 'lr_test@example.com', password: 'password123', role: 'LocalResident' },
    { email: 'sp_test@example.com', password: 'password123', role: 'ServiceProvider' },
    { email: 'user@example.com', password: 'password123', role: 'User' },
    { email: 'provider@example.com', password: '123456', role: 'ServiceProvider' }
];

const login = (data) => {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: JSON.parse(body) });
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
};

const runTests = async () => {
    for (const testCase of testCases) {
        console.log(`Testing login for: ${testCase.email} (${testCase.role})...`);
        try {
            const res = await login(testCase);
            console.log(`Status: ${res.status}`);
            if (res.status !== 200) {
                console.error('Error:', res.body.message);
            } else {
                console.log('Success!');
            }
        } catch (err) {
            console.error('Failed:', err.message);
        }
    }
};

runTests();
