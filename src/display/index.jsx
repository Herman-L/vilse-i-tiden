import {
    h,
    n,
    render,
    Component,
    Fragment
} from 'preact';

function formatTime(time, precision = 1) {
    if (time === null) time = 0;
    time = +time.toFixed(precision);
    let minutes = (time / 60000 | 0).toString();
    let seconds = (time / 1000 % 60).toFixed(precision).padStart(precision + 3, '0');
    return minutes + ':' + seconds;
}

class Display extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            startTime: null,
            endTime: null,
            segments: null,
        };

    }
    componentDidMount() {
        this.socket = new WebSocket(`ws://${location.host}/timer/`);
        this.socket.onmessage = message => this.setState(JSON.parse(message.data));

        this.setState({
            open: true,
        });

        this.socket.onclose = () => {
            this.socket = null;
            this.setState({
                open: false,
            });
        };
    }
    componentWillUnmount() {
        if (this.socket)
            this.socket.close();
    }

    render() {
        console.log(this.state);

        if (!this.state.open)
            return <p>Ingen kontakt med servern. Ladda om sidan för att försöka igen</p>;

        return <div>
            <Segments segments={this.state.segments || []} />
            <Timer startTime={this.state.startTime} endTime={this.state.endTime} />
        </div>;
    }
}

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            now: props.startTime,
        };
    }
    componentDidMount() {
        this.interval = setInterval(() => this.setState({
            now: Date.now(),
        }), 17);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        let time = this.props.startTime ? (this.props.endTime || this.state.now) - this.props.startTime : 0;
        return <p class='timer'>{formatTime(time, 3)}</p>;
    }
}

function Segments(props) {
    return <div class='segments'>{
        props.segments.map(segment => {
            let current = segment.current ? ' current' : '';
            return <div class={'segment' + current}>
                <div class='segment-name'>{segment.name}</div>
                <SegmentDiff time={segment.time} comparasion={segment.comparasion} />
                <div class='segment-time'>{formatTime(segment.time || segment.comparasion)}</div>
            </div>;
        })
    }</div>;
}

function SegmentDiff(props) {
    if (props.time === null || props.comparasion === null)
        return <div class='segment-diff' />;

    let diff = props.time - props.comparasion;
    diff = +(diff / 1000).toFixed(1);

    let sign = diff > 0 ? '+' : diff < 0 ? '-' : '';
    let className = 'segment-diff' + (diff > 0 ? ' positive' : diff < 0 ? ' negative' : ' neutral');
    diff = Math.abs(diff);

    let formatted;
    if (diff < 60)
        formatted = diff.toFixed(1);
    else
        formatted = (diff / 60 | 0) + ':' + (diff % 60 | 0).toString().padStart(2, '0');

    return <div class={className}>{sign + formatted}</div>;
}

render(<Display />, document.getElementById('root'));
