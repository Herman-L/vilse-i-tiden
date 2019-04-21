class Display extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: null,
        };

        let socket = new WebSocket(`ws://${location.host}/timer/`);
        socket.onmessage = message => {
            this.setState({
                message: message.data,
            });
        };
    }
    render() {
        return React.createElement('p', null, this.state.message);
    }
}

ReactDOM.render(
    React.createElement(Display),
    document.getElementById('root'),
);
