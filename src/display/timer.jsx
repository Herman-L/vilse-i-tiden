import {
    h,
    Component,
} from 'preact';
import {
    formatTime,
} from './format.jsx';

export default class Timer extends Component {
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
        const time = this.props.startTime ? (this.props.endTime || this.state.now) - this.props.startTime : 0;
        return <p class='timer'>{formatTime(time, 3)}</p>;
    }
}
