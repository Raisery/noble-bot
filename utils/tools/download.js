const path = require('path');
const { finished } = require('stream/promises');
const { Readable } = require('stream');
const fs = require('fs');
async function download(url, guild, folder, name) {
    const res = await fetch(url);
    const destination = path.resolve(
        './storage/' + guild.id + '/' + folder + '/',
        name + '.mp3'
    );
    if (fs.existsSync(destination)) return false;
    const fileStream = fs.createWriteStream(destination, {
        flags: 'wx',
    });
    await finished(Readable.fromWeb(res.body).pipe(fileStream));
    return true;
}

module.exports = download;
