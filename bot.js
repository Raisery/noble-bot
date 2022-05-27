const { Player } = require('discord-player');
const { Client, Intents, Collection } = require('discord.js');
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
client.annonce = new Collection();
client.player = new Player(client);

//evenements player a mettre dans le dossier ./events/player
/* 
client.player.on('trackStart', async (queue, track) => console.log("annonce en cours"));
client.player.on('queueEnd', async (queue, track) => console.log("fin de l'annonce"));
client.player.on('botDisconnect', async (queue) => console.log("destruction de la queue"));
client.player.on('channelEmpty', async (queue, track) => console.log("channel vide"));
client.player.on('connectionCreate', async (queue, track) => console.log("connection crée"));
client.player.on('connectionError', async (queue, track) => console.log("connection error"));
client.player.on('trackEnd', async (queue, track) => console.log("fin du son")); */

require('./utils/BDD/Functions')(client);
['CommandUtil', 'EventUtil'].forEach(async handler => { require(`./utils/handlers/${handler}`)(client) });

process.on('exit', code => { console.log(`Le processus s'est arrêté avec le code: ${code}`) });
process.on('uncaughtException', (err, origin) => { console.log(`UNCAUGHT_EXCEPTION: ${err}`, `Origine: ${origin}`) });
process.on('unhandledRejection', (reason, promise) => { console.log(`UNHANDLED_REJECTION: ${reason}\n----------\n`, promise) });
process.on('warning', (...args) => console.log(...args));

mongoose.connect(process.env.DB_URI, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
}).then(() => { console.log('Le client est connecté à la base de données !'); })
    .catch(err => { console.log(err); });

client.login(token);
