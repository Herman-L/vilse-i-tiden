import {
    h,
} from 'preact';
import {
    formatTime,
} from './format.jsx';

export default function Segments(props) {
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
