import chalk from 'chalk';
import userService from '../services/userService.js';
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

		if (command === 'readDiscordUsers') {
			await messageCommands.readDiscordUsers(message);
		}

		if (command === 'test') {
			messageCommands.testBot(message);
		}
    });
}

// async function getAndDisplayDiscordUsers(message) {
// 	try {
// 		const guild = message.guild;
// 		const currentUsers = await userService.readCurrentUsers(guild);

// 		console.log('User IDs and Names:', currentUsers);

// 		const formattedResponse = currentUsers
// 		.map(user => `Name: ${user.globalName} - UserName: ${user.name} - (ID: ${user.id})`)
// 		.join('\n');

// 		message.channel.send(`\n${formattedResponse}`);
// 	} catch (error) {
// 		console.error('Error while fetching user IDs and names:', error);
// 		message.channel.send('There was an error trying to fetch user IDs and names.');
// 	}
// }

export default {
  messageCreateHandler
};