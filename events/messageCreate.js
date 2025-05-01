module.exports = function(client) {
    const COMMAND_PREFIX = '#';
    const TARGET_CHANNEL_ID = 'YOUR_CHANNEL_ID_HERE';

    client.on('messageCreate', (message) => {
        console.log(message.author.globalName + " wrote " + message.content)
        if (
            message.author.bot ||
            message.channel.id !== TARGET_CHANNEL_ID ||
            !message.content.startsWith(COMMAND_PREFIX)
        ) 
        {
            return;
        }
    });
  };