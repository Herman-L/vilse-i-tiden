const https = require('https');

function httpProxy(destination) {
    return function(request, response, next) {
        https.get(destination + request.url, res => {
            response.writeHead(res.statusCode, {
                'content-type': res.headers['content-type'],
            });
            res.on('data', data => response.write(data));
            res.on('end', () => response.end());
        });
    };
}

module.exports = httpProxy;
