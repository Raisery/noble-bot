const isLongerThan = require('../../utils/tools/isLongerThan');
const reply = require('../../utils/tools/reply');
const { Annonce } = require('../../models/index');
const Logger = require('../../utils/Logger');
const { Collection } = require('discord.js');

module.exports = {
    name: "annonce",
    description: 'Enregistre l\'annonce passée en paramétre',
    category: 'troll',
    permissions: [],
    ownerOnly: false,
    usage: '/annonce [subcommand] <value>',
    examples: ['/annonce set sound effect blop', '/annonce set https://www.youtube.com/watch?v=0kAEthfslsE', '/annonce on', '/annonce off'],
    options: [
        {
            name: "set",
            description: "Modifie l'annonce",
            type: "SUB_COMMAND",
            permissions: [],
            usage: '/annonce set <song>',
            options: [
                {
                    name: 'song',
                    description: 'titre du son (URL Youtube, URL Spotify, texte',
                    type: 'STRING',
                    required: true,
                }
            ]
        },
        {
            name: "on",
            description: "Active l'annonce du bot pour toi",
            type: "SUB_COMMAND",
            usage: '/annonce on',
            permissions: []
        },
        {
            name: "off",
            description: "Désactive l'annonce du bot pour toi",
            type: "SUB_COMMAND",
            usage: '/annonce off',
            permissions: []
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply();
        if (interaction.options._subcommand === 'set') {
            const song = interaction.options.getString('song');

            const track = await client.player.search(song, {
                requestedBy: interaction.user
            }).then(x => x.tracks[0]);
            if (!track) {
                const error = await interaction.channel.send({ content: `❌ | Musique introuvable` });
                await sleep(3000);
                await error.delete();
                return
            }
            
            const guild = await client.getGuildFromBDD(interaction.guild);
            
            if (isLongerThan(track.duration, guild.durationLimit) || isLongerThan('0:06', track.duration)) {
                await interaction.deleteReply();
                await reply(interaction, `❌ Annonce trop longue ou trop courte (la durée doit être inférieure à ${guild.durationLimit} et superieure a 0:06`);
                return
            }

            var guildAnnonceList = await client.annonces.get(interaction.guild.id);
            if (!guildAnnonceList) {
                guildAnnonceList = new Collection();
            }

            guildAnnonceList.set(interaction.user.id, track);
            client.annonces.set(interaction.guild.id, guildAnnonceList);

            let annonceSettings = await client.getAnnonceFromBDD(interaction.member.user, interaction.guild);
            
            if (!annonceSettings) {
                await client.createAnnonceInBDD(interaction.member.user, interaction.guild, track);
            }
            else {
                await client.updateAnnonceInBDD(interaction.member.user, interaction.guild, track);
            }
            await interaction.deleteReply();
            await reply(interaction, "✔ Annonce enregistrée");
            return
        }

        if (interaction.options._subcommand === 'on') {
            await interaction.deleteReply();
            const annonceData = await client.getAnnonceFromBDD(interaction.user, interaction.guild);
            if(!annonceData) return reply(interaction, "Aucune annonce définie");

            var guildAnnonceList = await client.annonces.get(interaction.guild.id);
            if (!guildAnnonceList) {
                guildAnnonceList = new Collection();
            }
            const track = await client.player.search(annonceData.trackUrl, {
                requestedBy: interaction.user
            }).then(x => x.tracks[0]);
            
            guildAnnonceList.set(interaction.user.id, track);
            client.annonces.set(interaction.guild.id, guildAnnonceList);
            await reply(interaction, `Annonce activée`);
            return
        }

        if (interaction.options._subcommand === 'off') {
            await interaction.deleteReply();
            var guildAnnonceList = await client.annonces.get(interaction.guild.id);
            if (!guildAnnonceList) {
                guildAnnonceList = new Collection();
            }
            guildAnnonceList.delete(interaction.user.id);
            client.annonces.set(interaction.guild.id, guildAnnonceList);
            await reply(interaction, `Annonce désactivée`);
            return
        }
    }

}