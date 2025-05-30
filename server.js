const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

function createServer() {
  return http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    let contentType = 'text/html';

    switch (ext) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
}

const server = createServer();

function startServer(port = PORT, callback) {
  return server.listen(port, () => {
    if (callback) callback();
    console.log(`Server running on http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { server, startServer, createServer };
