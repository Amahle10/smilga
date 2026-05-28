const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World!');
}).listen(8080, '0.0.0.0', () => {
  console.log('Server is running on port 8080');
});

