const { Message } = require('discord.js');
const sleep = require("../../utils/tools/sleep");

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(client, message) {
        if(message.author.bot) return
        
    }
}