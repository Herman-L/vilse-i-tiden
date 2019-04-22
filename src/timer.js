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
        this.segments = this.config.segments.map(segment => ({
            name: segment.name,
            time: null,
            comparasion: segment.comparasion,
        }));

        this.emit('reset');
    }
    nextTrigger() {
        let trigger = this.segment + 1 < this.segments.length ?
            this.config.segments[this.segment + 1].trigger :
            this.config.endTrigger;

        return Array.isArray(trigger) ? trigger : [trigger, 0];
    }
    process(path) {
        if (path === '/')
            this.reset();

        if (this.endTime !== null)
            return;

        let [triggerPath, triggerOffset] = this.nextTrigger();
        if (triggerPath === path) {
            let now = Date.now() + triggerOffset;

            this.segment += 1;

            let isStart = this.segment === 0;
            let isEnd = this.segment === this.segments.length;

            if (isStart) {
                this.startTime = now;
                this.emit('start');
            } else {
                let segment = this.segments[this.segment - 1];
                segment.time = now - this.startTime;

                if (isEnd) this.endTime = now;

                this.emit('split');
                if (isEnd) this.emit('end');
            }
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
