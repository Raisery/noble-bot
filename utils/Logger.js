const chalk = require('chalk');
const dayjs = require('dayjs');

const format = '{tstamp} {tag} {txt}\n';


function error(content, promise = {}) {
    write(content, 'black', 'bgRed', 'ERROR', true);
    console.log(promise);
}

function warn(content, promise = {}) {
    write(content, 'black', 'bgYellow', 'WARN', false);
    console.log(promise);
}

function typo(content) {
    write(content, 'black', 'bgCyan', 'TYPO', false);
}

function command(content) {
    write(content, 'black', 'bgMagenta', 'COMMAND', false);
}

function event(content) {
    write(content, 'black', 'bgGreen', 'EVENT', false);
}

function client(content) {
    write(content, 'black', 'bgBlue', 'CLIENT', false);
}

function info(content) {
    write(content, 'black', 'bgWhite', 'INFO', false);
}

function write(content, tagColor, bgTagColor, tag, error = false) {
    const timestamp = `[${dayjs().format('DD/MM - HH:mm:ss')}]`;
    const logTag = `[${tag}]`;
    const stream = error ? process.stderr : process.stdout;

    const item = format
        .replace('{tstamp}', chalk.gray(timestamp))
        .replace('{tag}', chalk[bgTagColor][tagColor](logTag))
        .replace('{txt}', chalk.white(content));

    stream.write(item);
}

module.exports = { error, warn, typo, event, command, client, info };
