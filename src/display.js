const express = require('express');
const path = require('path');

class Display {
    constructor(timer) {
        this.timer = timer;
        this.connections = [];

        this.timer.on('reset', () => this.broadcast());
        this.timer.on('start', () => this.broadcast());
        this.timer.on('split', () => this.broadcast());
        this.timer.on('end', () => this.broadcast());
    }
    clientState() {
        return JSON.stringify({
            startTime: this.timer.startTime,
            endTime: this.timer.endTime,
            segments: this.timer.segments.map(segment => ({
                name: segment.name,
                time: segment.time,
            })),
        });
    }
    broadcast() {
        for (let ws of this.connections)
            ws.send(this.clientState());
    }
    middleware() {
        let router = new express.Router();
        router.use('/', express.static(path.join(__dirname, 'display')));
        router.ws('/', (ws, request) => {
            this.connections.push(ws);
            ws.send(this.clientState());
            ws.on('close', () => {
                let index = this.connections.indexOf(ws);
                this.connections.splice(index, 1);
            });
        });

        return router;
    }
}

module.exports = Display;
