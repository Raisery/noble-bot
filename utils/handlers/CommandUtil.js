import Logger from '../Logger.js'
import * as fs from 'fs'

export default async function CommandUtil(client) {
	const files = fs.readdirSync('./commands/', { withFileTypes: true, recursive: true })
	files.map(async cmdFile => {
		if (!cmdFile.isFile()) return false
		const cmd = (await import(`../../${cmdFile.path}/${cmdFile.name}`)).default
		if (!cmd.name)
			return Logger.warn(
				`Commande non-chargée: ajoutez un nom à votre commande \nFichier -> ${cmdFile}`
			)
		if (!cmd.category)
			return Logger.warn(`Commande non-chargée: Pas de catégorie \nFichier -> ${cmdFile}`)
		if (!cmd.description)
			return Logger.warn(
				`Commande non-chargée: Ajoutez une description à votre commande \nFichier -> ${cmdFile}`
			)
		if (!cmd.permissions)
			return Logger.warn(`Commande non-chargée: Pas de permissions \nFichier -> ${cmdFile}`)
		if (cmd.ownerOnly === undefined)
			return Logger.warn(`Commande non-chargée: Pas de valeur ownerOnly \nFichier -> ${cmdFile}`)
		if (!cmd.usage) return Logger.warn(`Commande non-chargée: Pas d'usage décrit \nFichier -> ${cmdFile}`)
		if (!cmd.examples) return Logger.warn(`Commande non-chargée: Pas d'exemples \nFichier -> ${cmdFile}`)

		client.commands.set(cmd.name, cmd)

		Logger.command(`- ${cmd.name}`)
	})
}
