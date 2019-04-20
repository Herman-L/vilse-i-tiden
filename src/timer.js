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

function timer() {
    let startTime = null;
    return function(request, response, next) {
        let now = Date.now();
        if (request.path == '/swf/intro.swf') {
            now -= 500;
            startTime = now;
        }

        if (MESSAGES.hasOwnProperty(request.path))
            console.log(`${now - startTime}: ${MESSAGES[request.path]}`);

        next();
    }
}

module.exports = timer;
