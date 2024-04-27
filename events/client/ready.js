import Logger from '../../utils/Logger.js'

export default {
	name: 'ready',
	once: true,
	async execute(client) {
		client.user.setActivity('test comme dab', { type: 'LISTENING' })
		const devGuild = await client.guilds.cache.get('1027380789773619250')
		await client.guilds.cache.forEach(guild => {
			guild.commands.set(client.commands.map(cmd => cmd))
			devGuild.commands.set(client.commands.map(cmd => cmd))
		})
		Logger.client(` - Connecté en tant que ${client.user.tag}! avec l'id : ${client.user.id}`)
	},
}
