const http = require('http');

const server = http.createServer((req, res) => {
    // 1. Add CORS headers to allow requests from your frontend port
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    // Optional: Allow common HTTP interaction methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle the preflight OPTIONS request that browsers automatically send
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 2. Send your normal data response
    res.writeHead(200, { 'Content-Type': 'application/json' }); 
    const data = { message: 'Welcome to our server', status: 'success' };
    res.end(JSON.stringify(data)); 
});

server.listen(3000, () => {
    console.log('Server is running on port 3000 with CORS enabled');
});
