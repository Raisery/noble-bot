const { Collection } = require('discord.js');
const { Annonce, Guild, Profanity, Song } = require('../../models');
const annonce = require('../../models/annonce');
const { modelName } = require('../../models/annonce');
const Logger = require('../Logger');
const sleep = require('../tools/sleep');

module.exports = (client) => {
    client.getAnnonceFromBDD = async (user, guild) => {
        const annonceData = await Annonce.findOne({
            user_id: user.id,
            guild_id: guild.id,
        });
        return annonceData;
    };

    client.createAnnonceInBDD = async (user, guild, songPath) => {
        const createAnnonce = new Annonce({
            user_id: user.id,
            guild_id: guild.id,
            song_path: songPath,
        });
        createAnnonce.save();
    };

    client.updateAnnonceInBDD = async (user, guild, song_path) => {
        var annonceData = await client.getAnnonceFromBDD(user, guild);

        if (!annonceData) {
            annonceData = await client.createAnnonceInBDD(
                user,
                guild,
                song_path
            );
        } else {
            annonceData.song_path = song_path;
            return await Annonce.updateOne(
                {
                    user_id: annonceData.user_id,
                    guild_id: annonceData.guild_id,
                },
                { song_path: annonceData.song_path }
            );
        }
    };

    client.getSongFromBDD = async (song, guild) => {
        const songData = await Song.findOne({
            title: song.title,
            guild_id: guild.id,
        });
        return songData;
    };

    client.createSongInBDD = async (user, guild, song) => {
        const createSong = new Song({
            user_id: user.id,
            guild_id: guild.id,
            created_at: new Date(),
            created_by: user.id,
            duration: song.duration,
            isTroll: song.isTroll,
            title: song.title,
            path: song.path,
        });
        createSong.save();
    };

    client.updateSongInBDD = async (guild, song) => {
        var songData = await client.getSongFromBDD(song, guild);

        songData.title = song.title;
        return await Song.updateOne(
            { title: songData.title, guild_id: songData.guild_id },
            { title: annonceData.title }
        );
    };

    client.getSongListFromBDD = async (guild) => {
        return await Song.find({}).exec();
    };

    client.getGuildFromBDD = async (guild) => {
        const guildData = await Guild.findOne({ id: guild.id });
        return guildData;
    };

    client.createGuildInBDD = async (guild) => {
        const createGuild = new Guild({
            id: guild.id,
            duration_limit: '0:10',
            ignored_voice_channels: [],
        });
        createGuild.save();
    };

    client.updateGuildInBDD = async (
        guild,
        { duration_limit = null, ignored_voice_channels = null }
    ) => {
        let guildData = await client.getGuildFromBDD(guild);
        if (typeof guildData != 'object' || !guildData) {
            guildData = {
                id: guild.id,
                duration_limit: '0:10',
                ignored_voice_channels: [],
            };
            await client.createGuildInBDD(guild);
        }
        if (!duration_limit) duration_limit = guildData.duration_limit;
        if (!ignored_voice_channels)
            ignored_voice_channels = guildData.ignored_voice_channels;
        guildData.duration_limit = duration_limit;
        guildData.ignored_voice_channels = ignored_voice_channels;
        guildData.id = guild.id;
        return await Guild.updateOne(guildData);
    };

    client.restoreAnnonce = async () => {
        var nbEchec = 0;
        var nbAnnonces = 0;

        const annonceList = await Annonce.find({});
        for (const annonce of annonceList) {
            const guild = await client.guilds.cache.get(annonce.guild_id);

            const users = await guild.members.fetch();
            const user = (await users.get(annonce.user_id)).user;

            var guildAnnonceList = new Collection();
            if (client.annonces.has(annonce.guild_id)) {
                guildAnnonceList = await client.annonces.get(annonce.guild_id);
            }

            guildAnnonceList.set(user.id, annonce.song_path);
            client.annonces.set(annonce.guild_id, guildAnnonceList);
            nbAnnonces++;
        }
        Logger.client(
            ` - ${nbAnnonces} annonces ont été restaurées et ${nbEchec} ont été abandonnées`
        );
        return;
    };

    client.getProfanityFromBDD = async (guild) => {
        const profanityParam = await Profanity.findOne({ guild_id: guild.id });
        return profanityParam;
    };

    client.createProfanityInBDD = async (guild) => {
        const createProfanity = new Profanity({
            guild_id: guild.id,
            customBadWords: [],
            punchlines: [],
        });
        createProfanity.save();
        return createProfanity;
    };

    client.updateProfanityInBDD = async (guild, profanityParam) => {
        let currentProfanityParam = await client.getProfanityFromBDD(guild);
        if (typeof currentProfanityParam != 'object') {
            currentProfanityParam = {
                guild_id: guild.id,
                customBadWords: [],
                punchlines: [],
            };
            await client.createProfanityInBDD(guild);
        }
        currentProfanityParam.customBadWords = profanityParam.customBadWords;
        currentProfanityParam.punchlines = profanityParam.punchlines;
        return Profanity.updateOne(currentProfanityParam);
    };
};
