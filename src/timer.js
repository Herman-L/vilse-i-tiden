const EventEmitter = require('events');
const fs = require('fs').promises;

class Timer extends EventEmitter {
    constructor(configPath) {
        super();
        this.config = null;
        this.configPath = configPath
        this.loadConfig().then(() => this.reset());
    }
    async loadConfig() {
        let json = await fs.readFile(this.configPath, 'UTF-8');
        this.config = JSON.parse(json);
    }
    async saveConfig() {
        let json = JSON.stringify(this.config, null, 2);
        await fs.writeFile(this.configPath, json);
    }
    async saveTimes() {
        if (this.segment > 0) {
            let times = this.segments.slice(0, this.segment).map(segment => segment.time);
            this.config.history.push(times.join(' '));
            await this.saveConfig();
        }
    }
    reset() {
        this.saveTimes();
        this.startTime = null;
        this.endTime = null;
        this.segment = -1;
        this.segments = this.config.segments.map(segment => ({
            name: segment.name,
            time: null,
            comparasion: null,
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
