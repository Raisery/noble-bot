module.exports = {
    name: "settings",
    category: "admin",
    permissions: ['ADMINISTRATOR'],
    ownerOnly: true,
    usage: 'settings [key] <value>',
    examples: ['settings', 'settings durationLimit', 'settings durationLimit 0:50'],
    description: 'Commande de paramétrage du bot',
    options: [
        {
            name: 'key',
            description: 'Afficher ou modifier la clé séléctionnée',
            type: 'STRING',
            choices: [
                {
                    name: "durationLimit",
                    value: "durationLimit"
                }
            ]
        },
        {
            name: 'value',
            description: 'Nouvelle valeur de la clé',
            type: 'STRING',
        }
    ],
    run: async (client, interaction) => {
        const key = interaction.options.getString('key');
        const value = interaction.options.getString('value');
        if (key == 'durationLimit') {
            if (value) {
                await client.updateGuildInBDD(interaction.guild, value);
                await interaction.reply(`Nouvelle valeur de durationLimit : ${value}`);
            } else {
                const guildData = await client.getGuildFromBDD(interaction.guild);
                await interaction.reply(`durationLimit actuelle : ${guildData.durationLimit}`);
            }
        }
        else {
            await interaction.reply(`Valeur de key : ${key}\nValeur de value: ${value}`);
        }

    }
}