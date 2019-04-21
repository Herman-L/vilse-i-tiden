const express = require('express');
const path = require('path');

class Display {
    constructor(timer) {

    }
    middleware() {
        let router = new express.Router();
        router.use('/', express.static(path.join(__dirname, 'display')));
        router.ws('/', (ws, request) => {
            ws.send('Hello, client!');
        });

        return router;
    }
}

module.exports = Display;
