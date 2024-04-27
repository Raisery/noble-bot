import path from 'path'
import { finished } from 'stream/promises'
import { Readable } from 'stream'
import fs from 'fs'

export default async function download(url, guild, folder, name) {
	const res = await fetch(url)
	const destination = path.resolve('./storage/' + guild.id + '/' + folder + '/', name + '.mp3')
	if (fs.existsSync(destination)) return false
	const fileStream = fs.createWriteStream(destination, {
		flags: 'wx',
	})
	await finished(Readable.fromWeb(res.body).pipe(fileStream))
	return true
}
