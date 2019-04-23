const fs = require('fs').promises;
const https = require('https');
const path = require('path');

async function httpProxy(destination) {
    let cache = new Map();

    function loadCache(path) {
        return new Promise((resolve, reject) => {
            https.get(destination + path, res => {
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
                    cache.set(path, {
                        status: status,
                        headers: headers,
                        data: Buffer.concat(fileData),
                    });
                    resolve();
                });
            });
        });
    }

    function writeCached(response, path) {
        let entry = cache.get(path);
        response.writeHead(entry.status, entry.headers);
        response.write(entry.data);
        response.end();
    }

    console.log('Cachar filer');
    let lines = await fs.readFile(path.join(__dirname, 'files.txt'), 'UTF-8');
    await Promise.all(lines.split('\n')
        .filter(s => s.length > 0)
        .map(s => loadCache(s.trim())));

    return async function(request, response, next) {
        if (!cache.has(request.path))
            await loadCache(request.path);

        writeCached(response, request.path);
    };
}

module.exports = httpProxy;
