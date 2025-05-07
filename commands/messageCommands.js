import userService from '../services/userService.js';

async function readDiscordUsers(message) {
	try {
		const guild = message.guild;
		const currentUsers = await userService.readCurrentUsers(guild);

		console.log('User IDs and Names:', currentUsers);

		const formattedResponse = currentUsers
		.map(user => `Name: ${user.globalName} - UserName: ${user.name} - (ID: ${user.id})`)
		.join('\n');

		message.channel.send(`\n${formattedResponse}`);
	} catch (error) {
		console.error('Error while fetching user IDs and names:', error);
		message.channel.send('There was an error trying to fetch user IDs and names.');
	}
};

function testBot(message) {
	message.channel.send(`Up and running`);
};

export default {
    readDiscordUsers,
	testBot
};