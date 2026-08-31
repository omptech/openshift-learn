// Simple static server
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const file = req.url === '/' ? 'index.html' : '.' + req.url;
    
    fs.readFile(file, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
        } else {
            res.writeHead(200);
            res.end(data);
        }
    });
});

server.listen(8000, () => console.log('Server running on http://localhost:8000')); 