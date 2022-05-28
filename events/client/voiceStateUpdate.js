const reply = require("../../utils/tools/reply");
const sleep = require("../../utils/tools/sleep");
const Logger = require('../../utils/Logger');

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(client, o, n) {

        //gestion des connections du bot
        if(n.member.user.bot) {
            if(n.channel == null && client.player.getQueue(o.guild)) {
                client.player.getQueue(o.guild).destroy();
            }
            return
        }

        //gestion des connections utilisateur
        const annonce = await (await client.annonces.get(n.guild.id)).get(n.id);
        if(o.channel == null && n.channel != null && annonce) {
            //envoyer l'annonceur
            const queue = await client.player.createQueue(n.guild, {
                metadata: {
                    channel: n.channel
                }
            });
    
            try {
                await queue.connect(n.channel);
            } catch {
                queue.destroy();
                await reply(interaction,"Impossible de rejoindre ton channel vocal");
                return
            }
            queue.play(annonce);
        }
    }
}