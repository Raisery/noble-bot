const { EmbedBuilder } = require('discord.js');
const sleep = require('./sleep');

async function reply(message, content) {
    const reponse = new EmbedBuilder().setDescription(content);

    const msg = await message.channel.send({ embeds: [reponse] });

    await sleep(3000);
    await msg.delete();
}

module.exports = reply;
