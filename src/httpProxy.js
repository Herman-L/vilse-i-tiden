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
        await Promise.all(files.split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(s => this.loadCache(s)));
    }
}

module.exports = HttpProxy;

const files = `
/
/common/css/games.css
/common/js/jquery-1.7.2.min.js
/GameContainer.swf
/js/8534c8b26b1b22273123.main.js
/sound/fa_snd_conveyor_bg.mp3
/sound/fa_snd_indoor_bg.mp3
/sound/fa_snd_indoor_bg_b.mp3
/sound/fa_snd_music_1.mp3
/sound/fa_snd_music_2.mp3
/sound/fa_snd_music_3.mp3
/sound/sk_snd_bg.mp3
/sound/sk_snd_music_1.mp3
/sound/sk_snd_music_2.mp3
/sound/sk_snd_music_3.mp3
/sound/sk_snd_water_bg.mp3
/sound/sk_snd_waterfall_bg.mp3
/sound/st_snd_cactus_123.mp3
/sound/st_snd_cave_bg.mp3
/sound/st_snd_mountain_bg.mp3
/sound/st_snd_music_1.mp3
/sound/st_snd_music_2.mp3
/sound/st_snd_music_3.mp3
/sound/st_snd_outdoor_bg.mp3
/swf/AssetPack_fa.swf
/swf/AssetPack_sk.swf
/swf/AssetPack_st.swf
/swf/AssetPack_un.swf
/swf/intro.swf
/swf/outro1.swf
/swf/outro2.swf
/video/vintergatan/flv/fa_1a.flv
/video/vintergatan/flv/fa_1b.flv
/video/vintergatan/flv/fa_2a.flv
/video/vintergatan/flv/fa_3a.flv
/video/vintergatan/flv/intro.flv
/video/vintergatan/flv/outro.flv
/video/vintergatan/flv/sk_1a.flv
/video/vintergatan/flv/sk_1a_alt.flv
/video/vintergatan/flv/sk_2a.flv
/video/vintergatan/flv/sk_3a.flv
/video/vintergatan/flv/sk_3a_alt.flv
/video/vintergatan/flv/sk_3b.flv
/video/vintergatan/flv/st_1a.flv
/video/vintergatan/flv/st_1a_alt.flv
/video/vintergatan/flv/st_1b.flv
/video/vintergatan/flv/st_1b_alt.flv
/video/vintergatan/flv/st_1c.flv
/video/vintergatan/flv/st_2a.flv
/video/vintergatan/flv/st_2a_alt.flv
/video/vintergatan/flv/st_2b.flv
/video/vintergatan/flv/st_3a.flv
/video/vintergatan/flv/st_3a_alt.flv
/video/vintergatan/flv/st_3b.flv
/video/vintergatan/flv/st_3b_alt.flv
/Vintergatan.swf
/xml/level_fa_1.xml
/xml/level_fa_2.xml
/xml/level_fa_3.xml
/xml/level_sk_1.xml
/xml/level_sk_2.xml
/xml/level_sk_3.xml
/xml/level_st_1.xml
/xml/level_st_2.xml
/xml/level_st_3.xml
`;
