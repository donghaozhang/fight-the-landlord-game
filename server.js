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
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      case '.mp3':
        contentType = 'audio/mpeg';
        break;
      case '.wav':
        contentType = 'audio/wav';
        break;
      case '.ogg':
        contentType = 'audio/ogg';
        break;
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        
        // Handle binary files (images and audio) vs text files differently
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || 
            ext === '.mp3' || ext === '.wav' || ext === '.ogg') {
          res.end(content); // Binary data, no encoding needed
        } else {
          res.end(content, 'utf-8'); // Text data with UTF-8 encoding
        }
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
