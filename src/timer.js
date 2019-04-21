const EventEmitter = require('events');

class Timer extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
    }
    process(path) {
        console.log(path);
    }
    middleware() {
        return (request, response, next) => {
            this.process(request.path);
            next();
        };
    }
}

module.exports = Timer;
