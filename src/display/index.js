class Display extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startTime: null,
            endTime: null,
        };

        let socket = new WebSocket(`ws://${location.host}/timer/`);
        socket.onmessage = message => this.setState(JSON.parse(message.data));
    }
    render() {
        return React.createElement('div', null, [
            React.createElement('p', null, 'Starttid: ' + (this.state.startTime && new Date(this.state.startTime))),
            React.createElement('p', null, 'Sluttid: ' + (this.state.endTime && new Date(this.state.endTime))),
        ]);
    }
}

ReactDOM.render(
    React.createElement(Display),
    document.getElementById('root'),
);
