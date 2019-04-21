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

    timer.on('reset', () => console.log('Nollställer timer'));
    timer.on('start', () => console.log('Startar timer'));
    timer.on('split', () => console.log(timer.segments[timer.segment - 1].name));
    timer.on('end', () => console.log('Stoppar timer'));

    server.use('/', timer.middleware());
    server.use('/', await httpProxy('https://media.svt.se/spel/vintergatan'));

    server.listen(PORT, () => console.log(`Server startad på http://localhost:${PORT}/`));
})();
