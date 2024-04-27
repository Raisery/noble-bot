import { Collection, ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js'
import reply from '../../utils/tools/reply.js'

const annonce = {
	name: 'annonce',
	description: "Enregistre l'annonce passée en paramétre",
	category: 'troll',
	permissions: [PermissionFlagsBits.SendMessages],
	ownerOnly: false,
	usage: '/annonce [subcommand] <value>',
	examples: ['/annonce set <id>', '/annonce on', '/annonce off'],
	options: [
		{
			name: 'set',
			description: "Modifie l'annonce",
			type: ApplicationCommandOptionType.Subcommand,
			permissions: [PermissionFlagsBits.SendMessages],
			usage: '/annonce set <id>',
			options: [
				{
					name: 'id',
					description:
						'id du son (Faire "/trollsong list" pour afficher la liste des sons disponibles)',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			name: 'on',
			description: "Active l'annonce du bot pour toi",
			type: ApplicationCommandOptionType.Subcommand,
			usage: '/annonce on',
			permissions: [],
		},
		{
			name: 'off',
			description: "Désactive l'annonce du bot pour toi",
			type: ApplicationCommandOptionType.Subcommand,
			usage: '/annonce off',
			permissions: [],
		},
	],
	run: async (client, interaction) => {
		await interaction.deferReply()
		if (interaction.options._subcommand === 'set') {
			const songId = interaction.options.getString('id')

			var guildAnnonceList = await client.annonces.get(interaction.guild.id)
			if (!guildAnnonceList) {
				guildAnnonceList = new Collection()
			}
			const trollSongList = await client.getSongListFromBDD(interaction.guild)
			if (!trollSongList[songId]) {
				interaction.deleteReply()
				reply(interaction, "❌ L'id ne correspond à aucun son !")
				return
			}

			var annonceBDD = await client.updateAnnonceInBDD(
				interaction.user,
				interaction.guild,
				trollSongList[songId].path
			)
			guildAnnonceList.set(interaction.user.id, trollSongList[songId])
			client.annonces.set(interaction.guild.id, guildAnnonceList)
			interaction.deleteReply()
			reply(interaction, '✔ Annonce enregistrée')
			return
		}

		if (interaction.options._subcommand === 'on') {
			await interaction.deleteReply()
			const annonceData = await client.getAnnonceFromBDD(interaction.user, interaction.guild)
			if (!annonceData) return reply(interaction, 'Aucune annonce définie')

			var guildAnnonceList = await client.annonces.get(interaction.guild.id)
			if (!guildAnnonceList) {
				guildAnnonceList = new Collection()
			}
			const track = await client.player
				.search(annonceData.trackUrl, {
					requestedBy: interaction.user,
				})
				.then(x => x.tracks[0])

			guildAnnonceList.set(interaction.user.id, track)
			client.annonces.set(interaction.guild.id, guildAnnonceList)
			await reply(interaction, `Annonce activée`)
			return
		}

		if (interaction.options._subcommand === 'off') {
			await interaction.deleteReply()
			var guildAnnonceList = await client.annonces.get(interaction.guild.id)
			if (!guildAnnonceList) {
				guildAnnonceList = new Collection()
			}
			guildAnnonceList.delete(interaction.user.id)
			client.annonces.set(interaction.guild.id, guildAnnonceList)
			await reply(interaction, `Annonce désactivée`)
			return
		}
	},
}

export default annonce
