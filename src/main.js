const express = require('express');
const httpProxy = require('./httpProxy.js');
const timer = require('./timer.js');

const server = express();
const PORT = 8000;

server.use('/', timer());
server.use('/', httpProxy('https://media.svt.se/spel/vintergatan'));

server.listen(PORT, () => console.log(`Server startad på http://localhost:${PORT}/`));
