const http = require('http');

const server = http.createServer((req, res) => {
    // 1. Tell the browser to expect JSON text, not HTML text
    res.writeHead(200, { 'Content-Type': 'application/json' }); 
    
    const data = { message: 'Welcome to our server', status: 'success' };
    
    // 2. Convert the object to a string stream and end the response
    res.end(JSON.stringify(data)); 
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000...');
});