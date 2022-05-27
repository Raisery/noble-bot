const { Annonce, Guild } = require('../../models');
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
        return Annonce.updateOne(annonceData).then(console.log(`Annonce modifiée : ${user.username} de la guild ${guild.name} a enregistré ${track.title} comme annonce`));
    }

    client.getGuildFromBDD = async (guild) => {
        const guildData = await Guild.findOne({ id: guild.id });
        return guildData
    };

    client.createGuildInBDD = async (guild) => {
        const createGuild = new Guild({ id: guild.id, durationLimit: "0:20" });
        createGuild.save().then(g => console.log(`Nouvelle Guild : ${guild.name} enregistrée`));
    }

    client.updateGuildInBDD = async (guild, durationLimit) => {
        let guildData = await client.getGuildFromBDD(guild);
        if(typeof guildData != 'object') guildData = {};
        guildData.durationLimit = durationLimit;
        guildData.id = guild.id;
        return Guild.updateOne(guildData).then(console.log(`Guild modifiée : ${guild.name} enregistrée avec durationLimit : ${durationLimit}`));
    }
}