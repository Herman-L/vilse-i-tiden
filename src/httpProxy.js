const fs = require('fs').promises;
const http = require('http');
const https = require('https');
const path = require('path');

const protocols = {http, https};

class HttpProxy {
    constructor(host) {
        this.host = host;
        this.cache = new Map();

        const protocol = (/^(.+?):/.exec(host) || ['', ''])[1];
        if (protocols.hasOwnProperty(protocol))
            this.protocol = protocols[protocol];
        else
            throw new Error(`The protocol '${protocol}' is unsupported`);
    }
    loadCache(path) {
        return new Promise((resolve, reject) => {
            this.protocol.get(this.host + path, res => {
                const status = res.statusCode;
                const headers = {
                    'content-type': res.headers['content-type'],
                    'cache-control': ['no-cache', 'must-revalidate'],
                    'expires': 0,
                };

                let fileData = [];
                res.on('data', data => fileData.push(data));

                res.on('end', () => {
                    this.cache.set(path, {
                        status: status,
                        headers: headers,
                        data: Buffer.concat(fileData),
                    });
                    resolve();
                });
            });
        });
    }
    writeCached(response, path) {
        const entry = this.cache.get(path);
        response.writeHead(entry.status, entry.headers);
        response.write(entry.data);
        response.end();
    }
    middleware() {
        return async (request, response, next) => {
            if (!this.cache.has(request.path))
                await this.loadCache(request.path);

            this.writeCached(response, request.path);
        };
    }
    async preload() {
        const lines = await fs.readFile(path.join(__dirname, 'files.txt'), 'UTF-8');
        await Promise.all(lines.split('\n')
            .filter(s => s.length > 0)
            .map(s => this.loadCache(s.trim())));
    }
}

module.exports = HttpProxy;
