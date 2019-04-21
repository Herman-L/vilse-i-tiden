const express = require('express');
const path = require('path');

class Display {
    constructor(timer) {
        this.timer = timer;
    }
    clientState() {
        return JSON.stringify({
            startTime: this.timer.startTime,
            endTime: this.timer.endTime,
        });
    }
    middleware() {
        let router = new express.Router();
        router.use('/', express.static(path.join(__dirname, 'display')));
        router.ws('/', (ws, request) => {
            ws.send(this.clientState());
        });

        return router;
    }
}

module.exports = Display;
