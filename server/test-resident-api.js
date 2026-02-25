const http = require('http');

const testResidentStats = async () => {
    const options = {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/resident/stats',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer YOUR_TOKEN_HERE' // This needs a real token to work, but I'll check error response at least
        }
    };

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (d) => { body += d; });
        res.on('end', () => {
            console.log('Status:', res.statusCode);
            console.log('Body:', body);
        });
    });

    req.on('error', (e) => { console.error(e); });
    req.end();
};

testResidentStats();
