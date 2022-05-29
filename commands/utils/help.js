const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "help",
    description: 'Renvoi la liste des commandes disponibles',
    category: 'utils',
    permissions: [],
    ownerOnly: false,
    usage: '/help <command>',
    examples: ['/help ', '/help settings ', '/help ping '],
    options: [
        {
            name: 'command',
            description: 'Commande sur laquelle tu veux des infos',
            type: 'STRING'
        }
    ],
    run: async (client, interaction) => {
        const embed = new MessageEmbed()
            .setTitle('❓ Help ❓')
            .setThumbnail(client.user.displayAvatarURL())
            /* .addFields(
                {name: 'Utils', value: `\n\`/ping\` : Affiche les infos de latence du bot\n`, inline: false },
                {name: 'Music', value: `\n\`/play\` : Joue la musique entrée en paramétre\n`, inline: false}
            ) */
            .setTimestamp()
            .setColor('DARK_GREEN')
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

        var request = interaction.options.getString('command');
        var name ='';
        if (request) {
            name = request;
            request = request.split(' ');
            if (client.commands.has(request[0])) {
                const tempCmd = await client.commands.get(request[0]);
                var cmd = await client.commands.get('help');
                if (request[1]) {
                    for (let subCommandGroup of tempCmd.options) {
                        if (request[2] && request[1] === subCommandGroup.name) {
                            for (let subCommand of subCommandGroup.options) {
                                if (subCommand.name === request[2]) {
                                    cmd = subCommand;
                                }
                            }
                        }
                        else {
                            if (!request[2]) {
                                if(request[1] === subCommandGroup.name) {
                                    cmd = subCommandGroup;
                                    cmd.examples = tempCmd.examples;
                                    cmd.category = tempCmd.category;
                                }
                            }
                        }
                    }
                }
                else {
                    cmd = tempCmd;
                    name = cmd.name;
                }
            }

            var optionsList = 'Aucunes';
            if (cmd.options) {
                optionsList = '';
                for (const option of cmd.options) {
                    optionsList += `${option.name}\n`
                }
            }
            embed.addFields(
                { name: 'Description :', value: `\`${cmd.description}\``, inline: false },
                { name: 'Catégorie :', value: `\`${cmd.category}\``, inline: false },
                { name: 'Permissions :', value: `\`${cmd.permissions.length ? cmd.permissions : 'Aucunes'}\``, inline: true },
                { name: 'Commande développeur :', value: `\`${cmd.ownerOnly ? 'OUI' : 'NON'}\``, inline: false },
                { name: 'Utilisation :', value: `\`${cmd.usage}\``, inline: true },
                { name: 'Options :', value: `\`${optionsList}\``, inline: false },
                { name: 'Exemples :', value: `\`${cmd.examples.join('\n')}\``, inline: false }
            ).setTitle(`❓ ${name} ❓`);

        }
        else {
            

        }
        await interaction.reply({ embeds: [embed], fetchReply: true });
        return

    }
}