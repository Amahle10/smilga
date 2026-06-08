const http = require('http');
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'YOUR_WORKBENCH_PASSWORD', // <-- Insert your Workbench root password
    database: 'my_server_db',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10
});

// Helper function to read data streams sent from the frontend browser
const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => { resolve(JSON.parse(body || '{}')); });
        req.on('error', err => reject(err));
    });
};

const server = http.createServer(async (req, res) => {
    // Enable CORS for frontend local development
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const urlParams = req.url.split('/');
    const id = urlParams[2]; // Extracts 'id' from URLs like /messages/5

    try {
        // --- 1. READ ALL (GET /messages) ---
        if (req.method === 'GET' && req.url === '/messages') {
            pool.query('SELECT * FROM messages', (err, results) => {
                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
            });
        }

        // --- 2. WRITE/CREATE (POST /messages) ---
        else if (req.method === 'POST' && req.url === '/messages') {
            const body = await getRequestBody(req);
            pool.query('INSERT INTO messages (text_content) VALUES (?)', [body.text_content], (err, result) => {
                if (err) throw err;
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Saved successfully', id: result.insertId }));
            });
        }

        // --- 3. EDIT/UPDATE (PUT /messages/id) ---
        else if (req.method === 'PUT' && req.url.startsWith('/messages/')) {
            const body = await getRequestBody(req);
            pool.query('UPDATE messages SET text_content = ? WHERE id = ?', [body.text_content, id], (err, result) => {
                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Updated successfully' }));
            });
        }

        // --- 4. DELETE (DELETE /messages/id) ---
        else if (req.method === 'DELETE' && req.url.startsWith('/messages/')) {
            pool.query('DELETE FROM messages WHERE id = ?', [id], (err, result) => {
                if (err) throw err;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Deleted successfully' }));
            });
        } 
        
        else {
            res.writeHead(404);
            res.end();
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server internal operations failed' }));
    }
});

server.listen(3000, () => {
    console.log('CRUD Server listening on http://localhost:3000');
});
