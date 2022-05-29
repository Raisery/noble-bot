const Logger = require('./utils/Logger');
const { Player } = require('discord-player');
const { Client, Intents, Collection } = require('discord.js');
require("discord-player/smoothVolume");
const { default: mongoose } = require('mongoose');
require("dotenv").config();
const token = process.env.BOT_TOKEN;
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});
client.commands = new Collection();
client.troll = new Collection();
client.annonces = new Collection();
client.player = new Player(client);

['CommandUtil', 'EventUtil'].forEach(async handler => { require(`./utils/handlers/${handler}`)(client) });
require('./utils/BDD/Functions')(client);

process.on('exit', code => { Logger.client(`Le processus s'est arrêté avec le code: ${code}`) });
process.on('uncaughtException', (err, origin) => { Logger.error(`UNCAUGHT_EXCEPTION: ${err}`, `Origine: ${origin}`) });
process.on('unhandledRejection', (reason, promise) => { Logger.warn(`UNHANDLED_REJECTION: ${reason}`, promise) });
process.on('warning', (...args) => Logger.warn(...args));

mongoose.connect(process.env.DB_URI, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
}).then(() => { Logger.client(' - Connecté à la base de données !'); })
    .catch(err => { Logger.error(err); });

client.login(token);
