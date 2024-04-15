const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);
const Logger = require('../Logger');

module.exports = async (client) => {
    (await pGlob(`${process.cwd()}/commands/*/*.js`)).map(async (cmdFile) => {
        const cmd = require(cmdFile);
        if (!cmd.name)
            return Logger.warn(
                `Commande non-chargée: ajoutez un nom à votre commande \nFichier -> ${cmdFile}`
            );
        if (!cmd.category)
            return Logger.warn(
                `Commande non-chargée: Pas de catégorie \nFichier -> ${cmdFile}`
            );
        if (!cmd.description)
            return Logger.warn(
                `Commande non-chargée: Ajoutez une description à votre commande \nFichier -> ${cmdFile}`
            );
        if (!cmd.permissions)
            return Logger.warn(
                `Commande non-chargée: Pas de permissions \nFichier -> ${cmdFile}`
            );
        if (cmd.ownerOnly === undefined)
            return Logger.warn(
                `Commande non-chargée: Pas de valeur ownerOnly \nFichier -> ${cmdFile}`
            );
        if (!cmd.usage)
            return Logger.warn(
                `Commande non-chargée: Pas d'usage décrit \nFichier -> ${cmdFile}`
            );
        if (!cmd.examples)
            return Logger.warn(
                `Commande non-chargée: Pas d'exemples \nFichier -> ${cmdFile}`
            );

        client.commands.set(cmd.name, cmd);

        Logger.command(`- ${cmd.name}`);
    });
};
