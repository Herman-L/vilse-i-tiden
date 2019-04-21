const express = require('express');
const fs = require('fs').promises;
const httpProxy = require('./httpProxy.js');
const path = require('path');
const Timer = require('./timer.js');

function formatTime(time) {
    let minutes = (time / 60000 | 0).toString().padStart(2, '0');
    let seconds = (time / 1000 % 60).toFixed(3).padStart(6, '0');
    return minutes + ':' + seconds;
}

(async () => {
    const server = express();
    const PORT = 8000;

    let config = JSON.parse(await fs.readFile(path.join(__dirname, '../config_any%.json')));
    let timer = new Timer(config);

    timer.on('reset', () => console.log('Nollställer timer'));
    timer.on('start', () => console.log('Startar timer'));
    timer.on('split', () => {
        let segment = timer.segments[timer.segment - 1];
        console.log(`[${formatTime(segment.time)}]: ${segment.name}`)
    });
    timer.on('end', () => console.log('Stoppar timer'));

    server.use('/', timer.middleware());
    server.use('/', await httpProxy('https://media.svt.se/spel/vintergatan'));

    server.listen(PORT, () => console.log(`Server startad på http://localhost:${PORT}/`));
})();
