const reply = require('../../utils/tools/reply')

module.exports = {
    name: 'tg',
    description: 'Déconnecte le bot du channel actuel',
    category: 'troll',
    permissions: [],
    ownerOnly: false,
    usage: '/tg',
    examples: ['/tg'],
    run: async (client, interaction) => {
        await interaction.deferReply()
        const queue = client.player.getQueue(interaction.guild)
        if (queue) {
            queue.destroy()
        }

        await interaction.deleteReply()
        await reply(interaction, 'Ok ok je ferme ma gueule')
    },
}
