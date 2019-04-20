const express = require('express');
const https = require('https');

const server = express();
const PORT = 8000;

server.use('/', (req, res, next) => {
    https.get('https://media.svt.se/spel/vintergatan' + req.path, response => {
        res.writeHead(response.statusCode, response.headers);
        response.on('data', data => res.write(data));
        response.on('end', () => res.end());
    });
});

server.listen(PORT, () => console.log(`Server startad på http://localhost:${PORT}/`));
