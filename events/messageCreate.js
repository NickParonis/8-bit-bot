import chalk from 'chalk';
import messageCommands from '../commands/messageCommands.js';

async function messageCreateHandler(client) {
    const COMMAND_PREFIX = '%';
    const TERMINAL_CHANNEL_ID = '1367078981593202740';

    client.on('messageCreate', async (message) => {
		console.log(
			chalk.blue(message.author.globalName) +
			chalk.white(' wrote ') +
			chalk.green(message.content)
      	);

		if (message.author.bot ||
				message.channel.id !== TERMINAL_CHANNEL_ID ||
				!message.content.startsWith(COMMAND_PREFIX)){
			return;
		}



		const command = message.content.slice(COMMAND_PREFIX.length).trim();
		const commandName = command.split(' ')[0];
		const args = command.slice(commandName.length).trim();

		if (commandName === 'readDiscordUsers') {
			await messageCommands.readDiscordUsers(message);
		}

		if (commandName === 'test') {
			messageCommands.testBot(message);
		}

		if (commandName === 'chat') {
			await messageCommands.chatBot(message, args);
		}

		if(commandName == 'join') {
			await messageCommands.joinUser(message);
		}
    });
}

export default {
  messageCreateHandler
};