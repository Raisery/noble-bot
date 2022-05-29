const reply = require("../../utils/tools/reply");
const Logger = require('../../utils/Logger');

module.exports = {
    name: "settings",
    category: "admin",
    permissions: ['ADMINISTRATOR'],
    ownerOnly: false,
    usage: 'settings #key# [subcommand] <value>',
    examples: ['settings durationLimit show', 'settings durationLimit set 0:50'],
    description: 'Commande de paramétrage du bot',
    options: [
        {
            name: 'duration_limit',
            description: 'Action sur la clé durationLimit -> Durée maximal d\'une annonce',
            type: 'SUB_COMMAND_GROUP',
            permissions: ['ADMINISTRATOR'],
            usage: 'settings duration_limit [subcommand] <value>',
            options: [
                {
                    name: 'show',
                    description: 'Affiche la valeur de durationLimit',
                    type: 'SUB_COMMAND',
                    permissions: ['ADMINISTRATOR'],
                    usage: 'settings duration_limit show',
                },
                {
                    name: 'set',
                    description: 'Change la valeur de durationLimit',
                    type: 'SUB_COMMAND',
                    permissions: ['ADMINISTRATOR'],
                    usage: 'settings duration_limit set <value>',
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
            permissions: ['ADMINISTRATOR'],
            usage: 'settings ignored_vc [subcommand] <value>',
            options: [
                {
                    name: "show",
                    description: 'Affiche la liste des voiceChannels ignorés',
                    type: 'SUB_COMMAND',
                    permissions: ['ADMINISTRATOR'],
                    usage: 'settings ignored_vc show',
                },
                {
                    name: "add",
                    description: 'Ajoute un voiceChannel à la liste des voiceChannels ignorés',
                    type: 'SUB_COMMAND',
                    permissions: ['ADMINISTRATOR'],
                    usage: 'settings ignored_vc add <channel_id>',
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
                    permissions: ['ADMINISTRATOR'],
                    usage: 'settings ignored_vc remove <channel_id>',
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
        },
        {
            name: 'custom_bad_words',
            type: 'SUB_COMMAND_GROUP',
            description: 'Action sur la clé customBadWords -> Liste des badWords personnalisés',            
            permissions: ['ADMINISTRATOR'],
            usage: 'settings custom_bad_words [subcommand] <value>',
            options: [
                {
                    name: "show",
                    description: 'Affiche la liste des badWords personnalisés',
                    type: 'SUB_COMMAND',                    
                    permissions: ['ADMINISTRATOR'],
                    usage: 'settings custom_bad_words show',
                },
                {
                    name: "add",
                    description: 'Ajoute un badWord à la liste des badWords personnalisés',
                    type: 'SUB_COMMAND',
                    permissions: ['ADMINISTRATOR'],
                    usage: 'settings custom_bad_words add <badword>',
                    options: [
                        {
                            name: 'badword',
                            description: 'badword à ajouter à la liste des badWords personnalisés',
                            type: 'STRING',
                            required: true,
                        }
                    ]
                },
                {
                    name: "remove",
                    description: 'Retire un badWord de la liste des badWords personnalisés',
                    type: 'SUB_COMMAND',
                    permissions: ['ADMINISTRATOR'],
                    usage: 'settings custom_bad_words remove <badword>',
                    options: [
                        {
                            name: 'badword',
                            description: 'badword à retirer de la liste des badWords personnalisés',
                            type: 'STRING',
                            required: true,
                        }
                    ]
                }
            ]
        },
        {
            name: 'punchlines',
            type: 'SUB_COMMAND_GROUP',
            permissions: ['ADMINISTRATOR'],
            description: 'Action sur la clé punchlines -> Liste des badWords personnalisés',
            usage: 'settings punchlines [subcommand] <value>',
            options: [
                {
                    name: "show",
                    description: 'Affiche la liste des punchlines personnalisés',
                    type: 'SUB_COMMAND',
                    permissions: ['ADMINISTRATOR'],
                    usage: 'settings punchlines show',
                },
                {
                    name: "add",
                    description: 'Ajoute une punchline à la liste des punchlines personnalisés',
                    type: 'SUB_COMMAND',
                    permissions: ['ADMINISTRATOR'],
                    usage: 'settings punchlines add <punchline>',
                    options: [
                        {
                            name: 'punchline',
                            description: 'punchline à ajouter à la liste des punchlines personnalisés',
                            type: 'STRING',
                            required: true,
                        }
                    ]
                },
                {
                    name: "remove",
                    description: 'Retire une punchline de la liste des punchlines',
                    type: 'SUB_COMMAND',
                    permissions: ['ADMINISTRATOR'],
                    usage: 'settings punchlines remove <index>',
                    options: [
                        {
                            name: 'index',
                            description: 'Index de la punchline à retirer de la liste des punchlines',
                            type: 'INTEGER',
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
                const format = /^\d\d[:]\d\d$/g
                if (durationLimit.match(format)) {
                    await client.updateGuildInBDD(interaction.guild, { durationLimit: durationLimit });
                    await interaction.reply(`Nouvelle valeur de durationLimit : ${durationLimit}`);
                }
                else {
                    await interaction.reply(`Format de valeur incorrecte -> la valeur doit être dans le format MINUTES:SECONDES ( ex: 04:23)`);
                }

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
                if (guildData.ignoredVC.includes(VC)) {
                    guildData.ignoredVC.splice(guildData.ignoredVC.indexOf(VC), 1);
                    await client.updateGuildInBDD(interaction.guild, guildData);
                    await interaction.reply(`${value} retiré de la liste`);
                }
                else {
                    await interaction.reply(`Le channel n'est pas dans la liste`);
                }
            }
            return
        }

        if (interaction.options._group === 'custom_bad_words') {
            if (interaction.options._subcommand === 'show') {
                var profanityParam = await client.getProfanityFromBDD(interaction.guild);
                if (!profanityParam) profanityParam = await client.createProfanityInBDD(interaction.guild);
                await interaction.reply(`Liste des badWords : ${profanityParam.customBadWords}`);
            }
            if (interaction.options._subcommand === 'add') {
                const value = interaction.options.getString('badword');
                const profanityParam = await client.getProfanityFromBDD(interaction.guild);
                profanityParam.customBadWords.push(value)
                await client.updateProfanityInBDD(interaction.guild, profanityParam)

                await interaction.reply(`Nouvelle valeur de customBadWords : ${profanityParam.customBadWords}`);
            }
            if (interaction.options._subcommand === 'remove') {
                const value = interaction.options.getString('badword');
                const profanityParam = await client.getProfanityFromBDD(interaction.guild);
                if (profanityParam.customBadWords.includes(value)) {
                    profanityParam.customBadWords.splice(profanityParam.customBadWords.indexOf(value), 1);
                    await client.updateProfanityInBDD(interaction.guild, profanityParam);
                    await interaction.reply(`${value} retiré de la liste`);
                }
                else {
                    await interaction.reply(`Le badword n'est pas dans la liste`);
                }
            }
            return
        }

        if (interaction.options._group === 'punchlines') {
            if (interaction.options._subcommand === 'show') {
                var profanityParam = await client.getProfanityFromBDD(interaction.guild);
                if (!profanityParam) profanityParam = await client.createProfanityInBDD(interaction.guild);
                var punchlines = '';
                let index = 0;
                for (const punch of profanityParam.punchlines) {
                    punchlines += `${index}. ${punch}\n`
                    index++;
                }
                await interaction.reply(`Liste des punchlines : \n${punchlines}`);
            }
            if (interaction.options._subcommand === 'add') {
                const value = interaction.options.getString('punchline');
                const profanityParam = await client.getProfanityFromBDD(interaction.guild);
                profanityParam.punchlines.push(value)
                await client.updateProfanityInBDD(interaction.guild, profanityParam)

                var punchlines = '';
                let index = 0;
                for (const punch of profanityParam.punchlines) {
                    punchlines += `${index}. ${punch}\n`
                    index++;
                }
                await interaction.reply(`Liste des punchlines : \n${punchlines}`);
            }
            if (interaction.options._subcommand === 'remove') {
                const value = interaction.options.getInteger('index');
                const profanityParam = await client.getProfanityFromBDD(interaction.guild);

                profanityParam.punchlines.splice(value, 1);
                await client.updateProfanityInBDD(interaction.guild, profanityParam);
                var punchlines = '';
                let index = 0;
                for (const punch of profanityParam.punchlines) {
                    punchlines += `${index}. ${punch}\n`
                    index++;
                }
                await interaction.reply(`Liste des punchlines : \n${punchlines}`);

            }
            return
        }
    }
}