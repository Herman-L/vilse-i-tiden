const express = require('express');
const expressWs = require('express-ws');
const fs = require('fs').promises;
const httpProxy = require('./httpProxy.js');
const path = require('path');

const Display = require('./display.js');
const Timer = require('./timer.js');

(async () => {
    let baseDir =  path.join(__dirname, '..');
    let configPath = path.join(baseDir, 'config.json');
    let config = JSON.parse(await fs.readFile(configPath, 'UTF-8'));

    let server = express();
    expressWs(server);

    console.log(path.join(baseDir, config.segments));
    let timer = new Timer(path.join(baseDir, config.segments));
    let display = new Display(timer);

    server.use('/timer', display.middleware());
    server.use('/', timer.middleware());
    server.use('/', express.static(path.join(__dirname, '../static/')));
    server.use('/', await httpProxy('https://media.svt.se/spel/vintergatan'));

    server.listen(config.port, () => console.log(`Server startad på http://localhost:${config.port}/`));
})();
