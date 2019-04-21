function formatTime(time) {
    if (time === null)
        return '-';
    let minutes = (time / 60000 | 0).toString();
    let seconds = (time / 1000 % 60).toFixed(3).padStart(6, '0');
    return minutes + ':' + seconds;
}

class Display extends React.Component {
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
        if (!this.state.open)
            return React.createElement('p', null, 'Ingen kontakt med servern. Ladda om sidan för att försöka igen.');

        return React.createElement('div', null,
            React.createElement(Segments, {
                segments: this.state.segments || [],
            }),
            React.createElement(Timer, {
                startTime: this.state.startTime,
                endTime: this.state.endTime,
            }),
        );
    }
}

class Timer extends React.Component {
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
        return React.createElement('p', null, formatTime(time));
    }
}

function Segments(props) {
    let divProps = {
        className: 'segments',
    };
    return React.createElement('div', divProps, props.segments.map(segment => {
        let fragmentProps = {
            key: JSON.stringify(segment),
        };
        return React.createElement(React.Fragment, fragmentProps,
            React.createElement('div', null, segment.name),
            React.createElement('div', null, formatTime(segment.time)),
        );
    }));
}

ReactDOM.render(
    React.createElement(Display),
    document.getElementById('root'),
);
