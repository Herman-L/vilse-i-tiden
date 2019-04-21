const https = require('https');

function httpProxy(destination) {
    let cache = new Map();

    function writeCached(response, path) {
        let entry = cache.get(path);
        response.writeHead(entry.status, entry.headers);
        response.write(entry.data);
        response.end();
    }

    return function(request, response, next) {
        if (cache.has(request.path))
            return writeCached(response, request.path);

        https.get(destination + request.url, res => {
            let status = res.statusCode;
            let headers = {
                'content-type': res.headers['content-type'],
                'cache-control': ['no-cache', 'no-store', 'must-revalidate'],
                'pragma': 'no-cache',
                'expires': 0,
            };
            let fileData = [];

            res.on('data', data => fileData.push(data));
            res.on('end', () => {
                cache.set(request.path, {
                    status: status,
                    headers: headers,
                    data: Buffer.concat(fileData),
                });
                writeCached(response, request.path);
            });
        });
    };
}

module.exports = httpProxy;
