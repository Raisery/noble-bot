import fs from 'fs'
import API from '../../utils/Database/api/API.js'
import Logger from '../../utils/Logger.js'

export default {
	name: 'guildCreate',
	once: false,
	async execute(client, guild) {
		API.AdvertGuild.create(guild.id, guild.name)
		Logger.client(" - I was invited in '" + guild.name + "' with id :" + guild.id)
		//client.createGuildInBDD(guild)
		//fs.mkdirSync('./storage/' + guild.id + '/')
		//fs.mkdirSync('./storage/' + guild.id + '/trolls/')
	},
}
