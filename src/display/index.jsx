import {
    h,
    render,
    Component,
} from 'preact';

import Segments from './segments.jsx';
import Timer from './timer.jsx';

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
        if (!this.state.open)
            return <p>Lost contact to the server. Reload the page to try again.</p>;

        return <div>
            <p class='category'>{this.state.name}</p>
            <Segments segments={this.state.segments || []} />
            <Timer startTime={this.state.startTime} endTime={this.state.endTime} />
        </div>;
    }
}

render(<Display />, document.getElementById('root'));
