export function formatTime(time, precision = 1) {
    if (time === null) time = 0;
    time = +time.toFixed(precision);
    let minutes = (time / 60000 | 0).toString();
    let seconds = (time / 1000 % 60).toFixed(precision).padStart(precision + 3, '0');
    return minutes + ':' + seconds;
}
