const sleep = require("./sleep");

async function send(channel, content) {
    const msg = await channel.send(content);
    await sleep(3000);
    await msg.delete();
  }
  
  module.exports = send;