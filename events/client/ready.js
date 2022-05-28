const Logger = require('../../utils/Logger');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {        
        client.user.setActivity('test comme dab', { type: "LISTENING" });
        const devGuild = await client.guilds.cache.get('971152670209486931');
        devGuild.commands.set(client.commands.map(cmd => cmd));

        Logger.client(` - Connecté en tant que ${client.user.tag}! avec l'id : ${client.user.id}`);
    }
}