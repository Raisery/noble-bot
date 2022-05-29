const Logger = require('../../utils/Logger');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {        
        client.user.setActivity('test comme dab', { type: "LISTENING" });
        await client.guilds.cache.forEach(guild => {
            guild.commands.set(client.commands.map(cmd => cmd));
        });;
        await client.restoreAnnonce();
        Logger.client(` - Connecté en tant que ${client.user.tag}! avec l'id : ${client.user.id}`);
    }
}