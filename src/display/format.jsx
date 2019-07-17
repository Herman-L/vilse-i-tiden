export function formatTime(time, precision = 1) {
    if (time === null) return '';
    time = +time.toFixed(precision);
    const minutes = (time / 60000 | 0).toString();
    const seconds = (time / 1000 % 60).toFixed(precision).padStart(precision + 3, '0');
    return minutes + ':' + seconds;
}
