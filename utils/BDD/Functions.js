const { Collection } = require('discord.js');
const { Annonce, Guild, Profanity } = require('../../models');
const annonce = require('../../models/annonce');
const { modelName } = require('../../models/annonce');
const Logger = require('../Logger');

module.exports = client => {
    client.getAnnonceFromBDD = async (user, guild) => {
        const annonceData = await Annonce.findOne({ userId: user.id, guildId: guild.id });
        return annonceData
    };

    client.createAnnonceInBDD = async (user, guild, track) => {
        const createAnnonce = new Annonce({ userId: user.id, guildId: guild.id, trackUrl: track.url });
        createAnnonce.save();
    }

    client.updateAnnonceInBDD = async (user, guild, track) => {
        let annonceData = await client.getAnnonceFromBDD(user, guild);
        if(typeof annonceData != 'object') annonceData = {};
        annonceData.trackUrl = track.url;
        annonceData.userId = user.id;
        annonceData.guildId = guild.id;
        return Annonce.updateOne(annonceData);
    }

    client.getGuildFromBDD = async (guild) => {
        const guildData = await Guild.findOne({ id: guild.id });
        return guildData
    };

    client.createGuildInBDD = async (guild) => {
        const createGuild = new Guild({ id: guild.id, durationLimit: "0:20", ignoredVC: [] });
        createGuild.save();
    }

    client.updateGuildInBDD = async (guild, {durationLimit = null, ignoredVC = null}) => {
        let guildData = await client.getGuildFromBDD(guild);
        if(typeof guildData != 'object') guildData = {id: guild.id, durationLimit: "0:20", ignoredVC: []};
        if(!durationLimit) durationLimit = guildData.durationLimit;
        if(!ignoredVC) ignoredVC = guildData.ignoredVC;
        guildData.durationLimit = durationLimit;
        guildData.ignoredVC = ignoredVC;
        guildData.id = guild.id;
        return Guild.updateOne(guildData);
    }


    client.restoreAnnonce = async () => {
        var nbEchec = 0;
        var nbAnnonces = 0;

        const annonceList = await Annonce.find({});
        for(const annonce of annonceList) {
            const guild = await client.guilds.cache.get(annonce.guildId);
            
            const users = await guild.members.fetch();
            const user = (await users.get(annonce.userId)).user;

            var guildAnnonceList = new Collection();
            if(client.annonces.has(annonce.guildId)) {
                guildAnnonceList = await client.annonces.get(annonce.guildId);
            }
            
            const track = await client.player.search(annonce.trackUrl, {
                requestedBy: user
            }).then(x => x.tracks[0]);
            
            if (!track) {
                Logger.error(`Immpossible de charger ${annonce.trackUrl} pour l'utilisateur ${annonce.userId}`);
                nbEchec++;
            }
            else {
                guildAnnonceList.set(user.id, track);
                client.annonces.set(annonce.guildId, guildAnnonceList);
                nbAnnonces++;
            }
        }
        Logger.info(` - ${nbAnnonces} annonces ont été restaurées et ${nbEchec} ont été abandonnées`);
        return 
    }

    client.getProfanityFromBDD = async (guild) => {
        const profanityParam = await Profanity.findOne({ guildId: guild.id });
        return profanityParam
    };

    client.createProfanityInBDD = async (guild) => {
        const createProfanity = new Profanity({ guildId: guild.id, customBadWords: [], punchlines: [] });
        createProfanity.save();
        return createProfanity;
    }

    client.updateProfanityInBDD = async (guild, profanityParam) => {
        let currentProfanityParam = await client.getProfanityFromBDD(guild);
        if(typeof currentProfanityParam != 'object') currentProfanityParam = { guildId: guild.id, customBadWords: [], punchlines: [] };
        currentProfanityParam.customBadWords = profanityParam.customBadWords;
        currentProfanityParam.punchlines = profanityParam.punchlines;
        return Profanity.updateOne(currentProfanityParam);
    }
}