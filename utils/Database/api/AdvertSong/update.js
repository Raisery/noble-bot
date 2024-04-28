export default async function (guildId, guildName) {
	if (typeof guildId !== 'string' || typeof guildName !== 'string') return null

	const data = {
		name: guildName,
	}

	const res = await fetch(process.env.API_URL + 'AdvertGuild/' + guildId, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bot ' + process.env.API_TOKEN,
		},
		body: JSON.stringify(data),
	})

	if (res.status === 202) return await res.json()

	return null
}
