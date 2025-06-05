const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

function createServer() {
  return http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
      filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.mp4': 'video/mp4',
      '.woff': 'application/font-woff',
      '.ttf': 'application/font-ttf',
      '.eot': 'application/vnd.ms-fontobject',
      '.otf': 'application/font-otf',
      '.wasm': 'application/wasm',
      '.glb': 'model/gltf-binary',
      '.gltf': 'model/gltf+json'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          fs.readFile('./404.html', (error, content) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
        } else {
          res.writeHead(500);
          res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
        }
      } else {
        // Set proper headers including content-length
        const headers = {
          'Content-Type': contentType,
          'Content-Length': content.length,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        };
        
        res.writeHead(200, headers);
        
        // For binary files (like GLB), don't specify encoding
        if (extname === '.glb' || extname === '.gltf' || extname === '.png' || extname === '.jpg' || extname === '.mp3' || extname === '.mp4') {
          res.end(content); // Binary data
        } else {
          res.end(content, 'utf-8'); // Text data
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
    console.log('3D dragon model support enabled for GLB files');
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { server, startServer, createServer };
