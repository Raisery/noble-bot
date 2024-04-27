import fs from 'fs'
import API from '../../utils/Database/api/API.js'
import Logger from '../../utils/Logger.js'

export default {
	name: 'guildDelete',
	once: false,
	async execute(client, guild) {
		API.AdvertGuild.remove(guild.id)
		Logger.client(" - I was kicked of '" + guild.name + "' with id :" + guild.id)
		//client.createGuildInBDD(guild)
		//fs.mkdirSync('./storage/' + guild.id + '/')
		//fs.mkdirSync('./storage/' + guild.id + '/trolls/')
	},
}
