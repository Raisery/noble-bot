const isLongerThan = require('../../utils/tools/isLongerThan');
const reply = require('../../utils/tools/reply');
const { Annonce } = require('../../models/index');
const Logger = require('../../utils/Logger');

module.exports = {
    name: "annonce",
    description: 'enregistre l\'url youtube passée en paramétre comme annonce',
    category: 'troll',
    options: [
        {
            name: "url",
            description: "URL de la vidéo youtube",
            type: "STRING",
        },
        {
            name: "activate",
            description: "Active ou désactive l'annonce du bot pour toi",
            type: "BOOLEAN",
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply();

        var url = interaction.options.getString("url");
        const activate = interaction.options.getBoolean('activate');

        if (activate != undefined) {
            if (!activate) {
                await interaction.deleteReply();
                client.annonce.delete(interaction.user.id);
                await reply(interaction, `Annonce désactivée`);
                return
            }
            else {
                const annonceData = await client.getAnnonceFromBDD(interaction.user, interaction.guild);
                if(!annonceData) {
                    await interaction.deleteReply();
                    await reply(interaction, 'Tu dois enregistrer une annonce avant !')
                    return
                }
                else {
                    url = annonceData.trackUrl;
                }
            }
        }

        if (!url) return await interaction.deleteReply();

        const track = await client.player.search(url, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) {
            const error = await message.channel.send({ content: `❌ | Musique introuvable` });
            await sleep(3000);
            error.delete();
            return
        }

        const guild = await client.getGuildFromBDD(interaction.guild);

        if (isLongerThan(track.duration, guild.durationLimit) || isLongerThan('0:06', track.duration)) {
            await interaction.deleteReply();
            await reply(interaction, `❌ Annonce trop longue ou trop courte (la durée doit être inférieure à ${guild.durationLimit} et superieure a 0:06`);
            return
        }

        client.annonce.set(interaction.user.id, track);
        let annonceSettings = await client.getAnnonceFromBDD(interaction.member.user, interaction.guild);
        if (!annonceSettings) {
            await client.createAnnonceInBDD(interaction.member.user, interaction.guild, track);
        }
        else {
            annonceSettings = await client.updateAnnonceInBDD(interaction.member.user, interaction.guild, track);
        }
        await interaction.deleteReply();
        await reply(interaction, "✔ Annonce enregistrée");
    }

}