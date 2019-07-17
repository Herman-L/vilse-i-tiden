const express = require('express');
const expressWs = require('express-ws');
const fs = require('fs').promises;
const path = require('path');

const Display = require('./display.js');
const HttpProxy = require('./httpProxy.js');
const Timer = require('./timer.js');

(async () => {
    let baseDir =  path.join(__dirname, '..');
    let configPath = path.join(baseDir, 'config.json');
    let config = JSON.parse(await fs.readFile(configPath, 'UTF-8'));

    let server = express();
    expressWs(server);

    let timer = new Timer(path.join(baseDir, config.segments));
    let display = new Display(timer);
    let proxy = new HttpProxy(config.host);

    await proxy.preload();

    server.use('/timer', display.middleware());
    server.use('/', timer.middleware());
    server.use('/', express.static(path.join(__dirname, '../static/')));
    server.use('/', proxy.middleware());

    server.listen(config.port, () => console.log(`Server startad på http://localhost:${config.port}/`));
})();
