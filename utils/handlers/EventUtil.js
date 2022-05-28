const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);
const Logger = require('../Logger');

module.exports = async client => {
    (await pGlob(`${process.cwd()}/events/*/*.js`)).map(async eventFile => {
        const event = require(eventFile);

        if(!eventList.includes(event.name) || !event.name) {
            return Logger.warn(`Evenement non chargé: erreur de typo (ou pas de nom) nom: ${event.name}\nFichier -> ${eventFile}`);
        }
        if(event.once && !event.player) {
            await client.once(event.name, async (...args) => await event.execute(client, ...args));
        } else if(!event.player){
            await client.on(event.name, async (...args) => await event.execute(client, ...args));
        } else if(event.player) {
            await client.player.on(event.name, async (...arg) => await event.execute(client, ...args));
        }

        Logger.event(` - ${event.name}`);
    });
}

const eventList = ['apiRequest','apiResponse','applicationCommandCreate','applicationCommandDelete','applicationCommandUpdate','channelCreate','channelDelete','channelPinsUpdate','channelUpdate','debug','emojiCreate','emojiDelete','emojiUpdate','error','guildBanAdd','guildBanRemove','guildCreate','guildDelete','guildIntegrationsUpdate','guildMemberAdd','guildMemberAvailable','guildMemberRemove','guildMembersChunk','guildMemberUpdate','guildScheduledEventCreate','guildScheduledEventDelete','guildScheduledEventUpdate','guildScheduledEventUserAdd','guildScheduledEventUserRemove','guildUnavailable','guildUpdate','interaction','interactionCreate','invalidated','invalidRequestWarning','inviteCreate','inviteDelete','message','messageCreate','messageDelete','messageDeleteBulk','messageReactionAdd','messageReactionRemove','messageReactionRemoveAll','messageReactionRemoveEmoji','messageUpdate','presenceUpdate','rateLimit','ready','roleCreate','roleDelete','roleUpdate','shardDisconnect','shardError','shardReady','shardReconnecting','shardResume','stageInstanceCreate','stageInstanceDelete','stageInstanceUpdate','stickerCreate','stickerDelete','stickerUpdate','threadCreate','threadDelete','threadListSync','threadMembersUpdate','threadMemberUpdate','threadUpdate','typingStart','userUpdate','voiceStateUpdate','warn','webhookUpdate', 'botDisconnect', 'channelEmpty', 'connectionCreate', 'connectionError', 'debug', 'error', 'queueEnd', 'trackAdd', 'trackEnd', 'tracksAdd', 'trackStart'];