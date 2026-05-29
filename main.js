const http = require('http');
http.createServer((req, res) => { // this line means specifiacclly req, and res arguments mean request and response, which are the objects that represent the incoming request and the outgoing response, respectively.
  res.writeHead(200, {'Content-Type': 'text/plain'}); // this writehead method is used to set the status code and headers for the response. In this case, it sets the status code to 200 (OK) and the Content-Type header to 'text/plain'.
  res.end('Hello World!');
}).listen(8080, '0.0.0.0', () => {
  console.log('Server is running on port 8080');
});

