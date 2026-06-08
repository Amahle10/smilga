const http = require('http');

const server = http.createServer((req, res) => {
    res.write('Welcome to our server');
    res.end();
});

server.listen(5000, () => {
    console.log('Server is listening on port 5000...');
});