import 'dotenv/config.js'
import { createAudioPlayer, AudioPlayerStatus } from '@discordjs/voice'
import Logger from './utils/Logger.js'
import { Client, GatewayIntentBits, Collection } from 'discord.js'
import * as mongoose from 'mongoose'
import Functions from './utils/Database/mongo/Functions.js'
import CommandUtil from './utils/handlers/CommandUtil.js'
import EventUtil from './utils/handlers/EventUtil.js'

const apiUrl = process.env.API_URL
const token = process.env.BOT_TOKEN

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers,
	],
})
Functions(client)

//Faire une fonction d'initialisation
client.commands = new Collection()
client.songs = new Collection()
client.trolls = new Collection()
client.annonces = new Collection()
client.guildsProfanity = new Collection()

client.player = createAudioPlayer()
client.player.on(AudioPlayerStatus.Idle, () => {
	client.player.subscription.connection.destroy()
})

CommandUtil(client)
EventUtil(client)

process.on('exit', code => {
	Logger.client(`Le processus s'est arrêté avec le code: ${code}`)
})
process.on('uncaughtException', (err, origin) => {
	Logger.error(`UNCAUGHT_EXCEPTION: ${err}`, `Origine: ${origin}`)
})
process.on('unhandledRejection', (reason, promise) => {
	Logger.warn(`UNHANDLED_REJECTION: ${reason}`, promise)
})
process.on('warning', (...args) => Logger.warn(...args))

mongoose
	.connect(process.env.DB_URI, {
		autoIndex: false,
		maxPoolSize: 10,
		serverSelectionTimeoutMS: 5000,
		socketTimeoutMS: 45000,
		family: 4,
	})
	.then(() => {
		Logger.client(' - Connecté à la base de données !')
	})
	.catch(err => {
		Logger.error(err)
	})

// test if api is online
fetch(apiUrl)
	.then(res => Logger.info(' - API online'))
	.catch(err => Logger.warn(' - API offline'), '')

client.login(token)
