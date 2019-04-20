const MESSAGES = {
    '/swf/intro.swf': 'Startar speedrun',
    '/xml/level_st_1.xml': 'Ökenlandskapet',
    '/xml/level_st_2.xml': 'Grottorna',
    '/xml/level_st_3.xml': 'Ürgüpernas berg',
    '/xml/level_sk_1.xml': 'Vattenfallen',
    '/xml/level_sk_2.xml': 'Sjöarna',
    '/xml/level_sk_3.xml': 'Höga skogen',
    '/xml/level_fa_1.xml': 'Löpande banden',
    '/xml/level_fa_2.xml': 'Lagret',
    '/xml/level_fa_3.xml': 'Fabrikstaket',
    '/swf/outro1.swf': 'Avslutar speedrun',
}

function formatTime(ms) {
    let m = (ms / 60000 | 0).toString().padStart(2, 0);
    let s = (ms / 1000 % 60).toFixed(3).padStart(6, 0);
    return `${m}:${s}`;
}

function timer() {
    let startTime = null;
    return function(request, response, next) {
        let now = Date.now();
        if (request.path == '/swf/intro.swf') {
            now -= 500;
            startTime = now;
        }

        if (MESSAGES.hasOwnProperty(request.path))
            console.log(`[${formatTime(now - startTime)}] ${MESSAGES[request.path]}`);

        next();
    }
}

module.exports = timer;
