
module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        
        console.log(`Connecté en tant que ${client.user.tag}! avec l'id : ${client.user.id}`);
        client.user.setActivity('test comme dab', { type: "LISTENING" });
        const devGuild = await client.guilds.cache.get('971152670209486931');
        devGuild.commands.set(client.commands.map(cmd => cmd));
    }
}