import Logger from '../Logger.js'
import * as fs from 'fs'

export default async function EventUtil(client) {
	const files = fs.readdirSync('./events/', { withFileTypes: true, recursive: true })
	files.map(async eventFile => {
		if (!eventFile.isFile()) return
		const event = (await import(`../../${eventFile.path}/${eventFile.name}`)).default

		if (!eventList.includes(event.name) || !event.name) {
			return Logger.warn(
				`Evenement non chargé: erreur de typo (ou pas de nom) nom: ${event.name}\nFichier -> ${eventFile}`
			)
		}
		if (event.once && !event.player) {
			await client.once(event.name, async (...args) => await event.execute(client, ...args))
		} else if (!event.player) {
			await client.on(event.name, async (...args) => await event.execute(client, ...args))
		} else if (event.player) {
			await client.player.on(event.name, async (...arg) => await event.execute(client, ...args))
		}

		Logger.event(` - ${event.name}`)
	})
}

const eventList = [
	'apiRequest',
	'apiResponse',
	'applicationCommandCreate',
	'applicationCommandDelete',
	'applicationCommandUpdate',
	'channelCreate',
	'channelDelete',
	'channelPinsUpdate',
	'channelUpdate',
	'debug',
	'emojiCreate',
	'emojiDelete',
	'emojiUpdate',
	'error',
	'guildBanAdd',
	'guildBanRemove',
	'guildCreate',
	'guildDelete',
	'guildIntegrationsUpdate',
	'guildMemberAdd',
	'guildMemberAvailable',
	'guildMemberRemove',
	'guildMembersChunk',
	'guildMemberUpdate',
	'guildScheduledEventCreate',
	'guildScheduledEventDelete',
	'guildScheduledEventUpdate',
	'guildScheduledEventUserAdd',
	'guildScheduledEventUserRemove',
	'guildUnavailable',
	'guildUpdate',
	'interaction',
	'interactionCreate',
	'invalidated',
	'invalidRequestWarning',
	'inviteCreate',
	'inviteDelete',
	'message',
	'messageCreate',
	'messageDelete',
	'messageDeleteBulk',
	'messageReactionAdd',
	'messageReactionRemove',
	'messageReactionRemoveAll',
	'messageReactionRemoveEmoji',
	'messageUpdate',
	'presenceUpdate',
	'rateLimit',
	'ready',
	'roleCreate',
	'roleDelete',
	'roleUpdate',
	'shardDisconnect',
	'shardError',
	'shardReady',
	'shardReconnecting',
	'shardResume',
	'stageInstanceCreate',
	'stageInstanceDelete',
	'stageInstanceUpdate',
	'stickerCreate',
	'stickerDelete',
	'stickerUpdate',
	'threadCreate',
	'threadDelete',
	'threadListSync',
	'threadMembersUpdate',
	'threadMemberUpdate',
	'threadUpdate',
	'typingStart',
	'userUpdate',
	'voiceStateUpdate',
	'warn',
	'webhookUpdate',
	'botDisconnect',
	'channelEmpty',
	'connectionCreate',
	'connectionError',
	'debug',
	'error',
	'queueEnd',
	'trackAdd',
	'trackEnd',
	'tracksAdd',
	'trackStart',
]
