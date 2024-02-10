const reply = require('../../utils/tools/reply');
const sleep = require('../../utils/tools/sleep');
const Logger = require('../../utils/Logger');

require('@discordjs/opus');
const { createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(client, o, n) {
        //gestion des connections du bot
        switch (getEventTriggered(o, n)) {
            case 'BOT':
                return;
            case 'CONNECTION':
                if (n.member.user.id == '514929867779866647')
                    playAnnonce(client, './storage/default/dun-dun-dun.mp3', n);
                else {
                    playAnnonce(client, './storage/default/Eeee.mp3', n);
                }
                return;
            case 'DISCONNECTION':
                return;
            case 'SWITCH':
                return;
            case 'STREAM_ON':
                playAnnonce(client, './storage/default/punch.mp3', n);
                return;
            case 'STREAM_OFF':
                playAnnonce(client, './storage/default/punch.mp3', n);
                return;
        }
    },
};

function getEventTriggered(o, n) {
    if (n.member.user.bot) return 'BOT';
    if (n.channelId == null) return 'DISCONNECTION';
    if (n.channelId != o.channelId && o.channelId == null) return 'CONNECTION';
    if (n.channelId != o.channelId && o.channelId != null) return 'SWITCH';
    if (n.streaming != o.streaming && o.streaming == false) return 'STREAM_ON';
    if (n.streaming != o.streaming && o.streaming == true) return 'STREAM_OFF';
    else return null;
}

function playAnnonce(client, pathSong, n) {
    const resource = createAudioResource(pathSong, {
        inlineVolume: true,
    });
    resource.volume.setVolume(0.15);
    client.player.play(resource);
    const connection = joinVoiceChannel({
        channelId: n.channelId,
        guildId: n.guild.id,
        adapterCreator: n.guild.voiceAdapterCreator,
    });
    client.player.subscription = connection.subscribe(client.player);
}
