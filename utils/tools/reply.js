const sleep = require("./sleep");

async function reply(channel, content ) {
     
     const msg = await channel.send({
       content: ``,
       embed: {
         description: content,
         color: 0xd43790
       },
       channel_id: keyDetails.channelId,
       message_reference: {
         message_id: keyDetails.messageId
       }
     });
   
     await sleep(3000);
     await msg.delete();
   }
   
   module.exports = reply;