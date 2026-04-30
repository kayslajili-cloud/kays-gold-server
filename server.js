const http = require('http');

let lastSignal = { signal: 'WAIT', price: '0', sl: '0', tp: '0', time: '' };

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route pour récupérer la clé API de façon sécurisée
  if (req.method === 'GET' && req.url === '/apikey') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ key: process.env.TWELVE_API_KEY || '' }));
    return;
  }

  if (req.method === 'POST' && req.url === '/signal') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        lastSignal = JSON.parse(body);
        lastSignal.time = new Date().toISOString();
        res.writeHead(200);
        res.end('OK');
      } catch(e) {
        res.writeHead(400);
        res.end('Bad Request');
      }
    });
  }

  else if (req.method === 'GET' && req.url === '/signal') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(lastSignal));
  }

  else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Serveur démarré sur port ' + PORT));
