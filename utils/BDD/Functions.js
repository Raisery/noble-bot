const { Annonce } = require('../../models');
const { modelName } = require('../../models/annonce');

module.exports = client => {
    client.getAnnonceFromBDD = async (user, guild) => {
        const annonceData = await Annonce.findOne({ userId: user.id, guildId: guild.id });
        return annonceData
    };

    client.createAnnonceInBDD = async (user, guild, track) => {
        const createAnnonce = new Annonce({ userId: user.id, guildId: guild.id, trackUrl: track.url });
        createAnnonce.save().then(a => console.log(`Nouvelle annonce : ${user.username} de la guild ${guild.name} a enregistré ${track.title} comme annonce`));
    }

    client.updateAnnonceInBDD = async (user, guild, track) => {
        let annonceData = await client.getAnnonceFromBDD(user, guild);
        if(typeof annonceData != 'object') annonceData = {};
        annonceData.trackUrl = track.url;
        annonceData.userId = user.id;
        annonceData.guildId = guild.id;
        return Annonce.updateOne(annonceData).then(console.log(`Annonce modifié : ${user.username} de la guild ${guild.name} a enregistré ${track.title} comme annonce`));
    }
}