export default {
	name: 'messageCreate',
	once: false,
	async execute(client, message) {
		if (message.author.bot) return
		const profanityParam = await client.getProfanityFromBDD(message.guild)
		if (!profanityParam) return

		const index = Math.floor(Math.random() * profanityParam.punchlines.length)

		var username = (await message.guild.members.cache.get(message.author.id)).nickname
		if (!username) {
			username = message.author.username
		}
		const reponse = `Police des chats 👮‍♂️🚔🚨\nFais gaffe a rester poli ${username}!\n${profanityParam.punchlines[index]}\nCordialement.`

		//test des expressions
		for (const badWord of profanityParam.customBadWords) {
			if (message.content.includes(badWord)) {
				await message.reply(reponse)
				return
			}
		}
	},
}
