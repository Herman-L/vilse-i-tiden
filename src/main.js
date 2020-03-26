const express = require('express');
const expressWs = require('express-ws');
const fs = require('fs').promises;
const path = require('path');

const Display = require('./display.js');
const HttpProxy = require('./httpProxy.js');
const Timer = require('./timer.js');

(async () => {
    const baseDir =  path.join(__dirname, '..');
    const configPath = path.join(baseDir, 'config.json');
    const config = JSON.parse(await fs.readFile(configPath, 'UTF-8'));

    let server = express();
    expressWs(server);

    let timer = new Timer(path.join(baseDir, config.segments));
    let display = new Display(timer);
    let proxy = new HttpProxy(config.host);

    (async () => {
        console.log('Caching the files');
        await proxy.preload();
        console.log('All files cached');
    })();

    server.use('/timer', display.middleware());
    server.use('/', timer.middleware());
    server.use('/', express.static(path.join(__dirname, '../static/')));
    server.use('/', proxy.middleware());

    server.listen(config.port, () => console.log(`Server started on http://localhost:${config.port}/`));
})();
