const EventEmitter = require('events');
const fs = require('fs').promises;

class Timer extends EventEmitter {
    constructor(segmentPath) {
        super();
        this.segmentConfig = null;
        this.segmentPath = segmentPath;
        this.loadConfig().then(() => this.reset());
    }
    async loadConfig() {
        let json = await fs.readFile(this.segmentPath, 'UTF-8');
        this.segmentConfig = JSON.parse(json);
    }
    async saveConfig() {
        let json = JSON.stringify(this.segmentConfig, null, 2);
        await fs.writeFile(this.segmentPath, json);
    }
    async saveTimes() {
        if (this.segment > 0 && !this.saved) {
            let times = this.segments.slice(0, this.segment).map(segment => segment.time);
            this.segmentConfig.history.push(times.join(' '));
            await this.saveConfig();
            this.saved = true;
        }
    }
    bestRun() {
        let best = [];
        for (let run of this.segmentConfig.history) {
            run = run.split(' ').map(n => parseInt(n));
            if (run.length < best.length)
                continue;
            if (run[run.length - 1] < best[best.length - 1] || run.length > best.length)
                best = run;
        }
        return best;
    }
    reset() {
        this.saveTimes();
        this.startTime = null;
        this.endTime = null;
        this.segment = -1;
        this.saved = false;
        let best = this.bestRun();
        this.segments = this.segmentConfig.segments.map((segment, i) => ({
            name: segment.name,
            time: null,
            comparasion: i < best.length ? best[i] : null,
        }));

        this.emit('reset');
    }
    nextTrigger() {
        let trigger = this.segment + 1 < this.segments.length ?
            this.segmentConfig.segments[this.segment + 1].trigger :
            this.segmentConfig.endTrigger;

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
                if (isEnd) {
                    this.emit('end');
                    this.saveTimes();
                }
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
