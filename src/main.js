const Display = require('./display.js');
const express = require('express');
const fs = require('fs').promises;
const httpProxy = require('./httpProxy.js');
const path = require('path');
const Timer = require('./timer.js');

(async () => {
    const server = express();
    const PORT = 8000;

    let config = JSON.parse(await fs.readFile(path.join(__dirname, '../config_any%.json')));
    let timer = new Timer(config);

    let display = new Display(timer);

    server.use('/timer', display.middleware());
    server.use('/', timer.middleware());
    server.use('/', await httpProxy('https://media.svt.se/spel/vintergatan'));

    server.listen(PORT, () => console.log(`Server startad på http://localhost:${PORT}/`));
})();
