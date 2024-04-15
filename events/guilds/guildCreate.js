const fs = require('fs');

module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, guild) {
        client.createGuildInBDD(guild);
        fs.mkdirSync('./storage/' + guild.id + '/');
        fs.mkdirSync('./storage/' + guild.id + '/trolls/');
    },
};
