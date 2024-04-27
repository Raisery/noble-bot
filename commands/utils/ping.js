import { EmbedBuilder } from 'discord.js'

const ping = {
	name: 'ping',
	description: 'Affiche la latence du bot',
	category: 'utils',
	permissions: [],
	ownerOnly: false,
	usage: '/ping',
	examples: ['/ping'],
	run: async (client, interaction) => {
		const embed = new EmbedBuilder()
			.setTitle('📊 Ping 📊')
			.setThumbnail(client.user.displayAvatarURL())
			.addFields(
				{ name: 'Latence', value: `\`${client.ws.ping}ms\``, inline: false },
				{
					name: 'Dernier restart',
					value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`,
					inline: false,
				}
			)
			.setTimestamp()
			.setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })

		await interaction.reply({ embeds: [embed], fetchReply: true })
	},
}

export default ping
