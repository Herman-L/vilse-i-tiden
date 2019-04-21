const EventEmitter = require('events');

class Timer extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.reset();
    }
    reset() {
        this.startTime = null;
        this.endTime = null;
        this.segment = -1;
    }
    nextTrigger() {
        let trigger = this.segment + 1 < this.config.segments.length ?
            this.config.segments[this.segment + 1].trigger :
            this.config.endTrigger;

        return Array.isArray(trigger) ? trigger : [trigger, 0];
    }
    process(path) {
        if (path === '/')
            this.reset();

        if (this.endTime !== null)
            return;

        let [triggerPath, triggerOffset] = this.nextTrigger();
        if (triggerPath == path) {
            let now = Date.now() + triggerOffset;

            if (this.segment >= 0) {
                console.log(`[${now - this.startTime}]: ${this.config.segments[this.segment].name}`);
            } else {
                console.log('Startar timer')
            }

            this.segment += 1;

            if (this.segment == 0)
                this.startTime = now;
            else if(this.segment == this.config.segments.length)
                this.endTime = now;
        }
    }
    middleware() {
        return (request, response, next) => {
            this.process(request.path);
            next();
        };
    }
}

module.exports = Timer;
