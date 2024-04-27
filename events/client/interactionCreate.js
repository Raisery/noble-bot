export default {
	name: 'interactionCreate',
	once: false,
	async execute(client, interaction) {
		if (interaction.isCommand()) {
			const cmd = client.commands.get(interaction.commandName)
			cmd.run(client, interaction)
		}
	},
}
