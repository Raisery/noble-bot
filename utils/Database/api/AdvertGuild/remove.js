export default async function (guildId) {
	if (typeof guildId !== 'string') return false

	const res = await fetch(process.env.API_URL + 'AdvertGuild/' + guildId, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bot ' + process.env.API_TOKEN,
		},
	})

	if (res.status === 202) return true

	return false
}
