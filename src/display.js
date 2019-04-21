const express = require('express');
const path = require('path');

class Display {
    constructor(timer) {

    }
    middleware() {
        return express.static(path.join(__dirname, 'display'))
    }
}

module.exports = Display;
