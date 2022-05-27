module.exports = {
    name: 'guildCreate',
    once: false,
    async execute(client, guild) {
        client.createGuildInBDD(guild);
    }
} 