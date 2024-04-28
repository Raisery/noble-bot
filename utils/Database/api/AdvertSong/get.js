export default async function (guildId) {
	if (typeof guildId !== 'string') return null

	const res = await fetch(process.env.API_URL + 'AdvertGuild/' + guildId, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bot ' + process.env.API_TOKEN,
		},
	})

	if (res.status === 200) return await res.json()

	return null
}
