const http = require('http');
const mysql = require('mysql2');

// 1. Establish the Workbench connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password', // <-- Insert your Workbench root password here
    database: 'my_server_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 5
});

const server = http.createServer((req, res) => {
    // 2. Set strict CORS boundaries for your frontend Live Server port
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/') {
        // 3. Request data directly from the active table
        pool.query('SELECT text_content FROM messages LIMIT 1', (err, results) => {
            if (err) {
                console.error("Database connection error:", err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to extract database text.' }));
                return;
            }

            // Read the dynamic text payload from the SQL results array
            const dynamicMessage = results.length > 0 ? results[0].text_content : 'Table is empty';

            // 4. Return structural JSON payload back to the browser
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: dynamicMessage, status: 'success' }));
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(3000, () => {
    console.log('Backend linked to MySQL Workbench. Listening on http://localhost:3000');
});
