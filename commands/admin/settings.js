const reply = require("../../utils/tools/reply");
const Logger = require('../../utils/Logger');

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
            name: 'duration_limit',
            description: 'Action sur la clé durationLimit -> Durée maximal d\'une annonce',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'show',
                    description: 'Affiche la valeur de durationLimit',
                    type: 'SUB_COMMAND'
                },
                {
                    name: 'set',
                    description: 'Change la valeur de durationLimit',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'value',
                            description: 'Nouvelle valeur de durationLimit en format <minute:secondes> (00:20)',
                            type: 'STRING',
                            required: true,
                        }
                    ]
                }
            ]
        },
        {
            name: 'ignored_vc',
            type: 'SUB_COMMAND_GROUP',
            description: 'Action sur la clé ignoredVC -> Liste des voiceChannels ignorés par l\'annonce',
            options: [
                {
                    name: "show",
                    description: 'Affiche la liste des voiceChannels ignorés',
                    type: 'SUB_COMMAND'
                },
                {
                    name: "add",
                    description: 'Ajoute un voiceChannel à la liste des voiceChannels ignorés',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'channel_id',
                            description: 'ID du voiceChannel à ignorer',
                            type: 'STRING',
                            required: true,
                        }
                    ]
                },
                {
                    name: "remove",
                    description: 'Retire un voiceChannel de la liste des voiceChannels ignorés',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'channel_id',
                            description: 'ID du voiceChannel à ne plus ignorer',
                            type: 'STRING',
                            required: true,
                        }
                    ]
                }
            ]
        }
    ],
    run: async (client, interaction) => {
        if (interaction.options._group === 'duration_limit') {
            if (interaction.options._subcommand === 'show') {
                const guildData = await client.getGuildFromBDD(interaction.guild);
                await interaction.reply(`durationLimit actuelle : ${guildData.durationLimit}`);
            }
            if (interaction.options._subcommand === 'set') {
                const durationLimit = interaction.options.getString('value');
                //ajouter une verification du format de la limite
                await client.updateGuildInBDD(interaction.guild, { durationLimit: durationLimit });
                await interaction.reply(`Nouvelle valeur de durationLimit : ${durationLimit}`);
            }
            return
        }

        if (interaction.options._group === 'ignored_vc') {
            if (interaction.options._subcommand === 'show') {
                const guildData = await client.getGuildFromBDD(interaction.guild);
                await interaction.reply(`Liste des VC ignorés : ${guildData.ignoredVC}`);
            }
            if (interaction.options._subcommand === 'add') {
                const value = interaction.options.getString('channel_id');
                const VC = await interaction.guild.channels.cache.get(value);
                if (!VC || VC.type != 'GUILD_VOICE') return interaction.reply('Tu dois entrer un voice chat valide');
                const guildData = await client.getGuildFromBDD(interaction.guild);
                guildData.ignoredVC.push(VC)
                await client.updateGuildInBDD(interaction.guild, guildData)

                await interaction.reply(`Nouvelle valeur de ignoredVC : ${value}`);
            }
            if (interaction.options._subcommand === 'remove') {
                const value = interaction.options.getString('channel_id');
                const VC = await interaction.guild.channels.cache.get(value);
                if (!VC || VC.type != 'GUILD_VOICE') return interaction.reply('Tu dois entrer un voice chat valide');
                const guildData = await client.getGuildFromBDD(interaction.guild);
                if(guildData.ignoredVC.includes(VC)) {
                    guildData.ignoredVC.splice(guildData.ignoredVC.indexOf(VC),1);
                    await client.updateGuildInBDD(interaction.guild, guildData);
                    await interaction.reply(`${value} retiré de la liste`);
                }
                else {
                    await interaction.reply(`Le channel n'est pas dans la liste`);
                }
            }
            return
        }
    }
}