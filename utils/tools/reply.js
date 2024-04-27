import { EmbedBuilder } from 'discord.js'
import sleep from './sleep.js'

export default async function reply(message, content) {
	const reponse = new EmbedBuilder().setDescription(content)

	const msg = await message.channel.send({ embeds: [reponse] })

	await sleep(3000)
	await msg.delete()
}
