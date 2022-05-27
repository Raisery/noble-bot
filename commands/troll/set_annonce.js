const isLongerThan = require('../../utils/tools/isLongerThan');
const reply = require('../../utils/tools/reply');
const { Annonce } = require('../../models/index')
const durationLimit = '10:00';

module.exports = {
    name: "set_annonce",
    description: 'enregistre l\'url youtube passée en paramétre comme annonce',
    category: 'troll',
    options : [
        {
            name: "url",
            description: "URL de la vidéo youtube",
            type: "STRING",
            required: true
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply();
        
        
        const url = interaction.options.getString("url");
        if(url.toLowerCase() == "false") {
            if(client.annonce.has(interaction.user.id)) {
                client.annonce.delete(interaction.user.id);
                await reply(interaction, "Annonce supprimée");
            }
            else {
                await reply(interaction, "Aucune annonce enregistrée");
            }
            await interaction.deleteReply();
            return
        }
        const track = await client.player.search(url, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) {
            const error = await message.channel.send({ content: `❌ | Musique introuvable` });
            await sleep(3000);
            error.delete();
            return
        } 
        
        if(isLongerThan(track.duration, durationLimit)) {
            await interaction.deleteReply();
            await reply(interaction, `Annonce trop longue (la durée doit être inférieure à ${durationLimit}`);  
            return
        }

        client.annonce.set(interaction.user.id, track);    
        let annonceSettings = await client.getAnnonceFromBDD(interaction.member.user, interaction.guild);
        if(!annonceSettings) {
            await client.createAnnonceInBDD(interaction.member.user, interaction.guild, track);
        }   
        else {
            await client.updateAnnonceInBDD(interaction.member.user, interaction.guild, track);
        }
        console.log(`valeur d'annonce ${annonceSettings}`);
        await interaction.deleteReply();
        await reply(interaction, "Annonce enregistrée");        
    }
        
}