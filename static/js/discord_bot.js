const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  console.log('Ready!');
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith('!postMessage')) {
    const args = message.content.slice('!postMessage'.length).trim().split(/ +/);
    const slackId = args.shift();
    const formattedMessage = args.join(' ');

    const payload = {
      userID: slackId,
      formattedMessage: formattedMessage,
    };

    try {
      // Assuming you have a designated channel to send the message in
      const channel = client.channels.cache.get('YOUR_CHANNEL_ID');
      if (!channel) return console.error('Channel not found');

      // Sending the message
      const sentMessage = await channel.send({ content: formattedMessage });
      console.log('Message sent:', sentMessage.content);
    } catch (error) {
      console.error('Error:', error);
    }
  }
});