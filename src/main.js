const Display = require('./display.js');
const express = require('express');
const expressWs = require('express-ws');
const httpProxy = require('./httpProxy.js');
const path = require('path');
const Timer = require('./timer.js');

const PORT = 8000;

(async () => {
    let server = express();
    expressWs(server);

    let timer = new Timer(path.join(__dirname, '../config_any%.json'));
    let display = new Display(timer);

    server.use('/timer', display.middleware());
    server.use('/', timer.middleware());
    server.use('/', express.static(path.join(__dirname, '../static/')));
    server.use('/', await httpProxy('https://media.svt.se/spel/vintergatan'));

    server.listen(PORT, () => console.log(`Server startad på http://localhost:${PORT}/`));
})();
