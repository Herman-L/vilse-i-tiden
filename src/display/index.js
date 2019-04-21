class Display extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            startTime: null,
            endTime: null,
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
        }
    }
    componentWillUnmount() {
        if (this.socket)
            this.socket.close();
    }

    render() {
        if (!this.state.open)
            return React.createElement('p', null, 'Ingen kontakt med servern. Ladda om sidan för att försöka igen.');

        return React.createElement(Timer, {
            startTime: this.state.startTime,
            endTime: this.state.endTime,
        });
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
        console.log(this.props.startTime, this.props.endTime, this.state.now);
        return React.createElement('p', null, (time / 1000).toFixed(3));
    }
}

ReactDOM.render(
    React.createElement(Display),
    document.getElementById('root'),
);
