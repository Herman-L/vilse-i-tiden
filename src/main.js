const express = require('express');
const httpProxy = require('./httpProxy.js');
const Timer = require('./timer.js');

(async () => {
    const server = express();
    const PORT = 8000;

    let timer = new Timer();

    server.use('/', timer.middleware());
    server.use('/', await httpProxy('https://media.svt.se/spel/vintergatan'));

    server.listen(PORT, () => console.log(`Server startad på http://localhost:${PORT}/`));
})();
