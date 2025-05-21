import userService from '../services/userService.js';
import voiceService from '../services/voiceService.js';

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

async function findUserVoiceChannelId(guild, userId) {
    try{
        var channelId = await userService.findUserVoiceChannelId(guild, userId)
        return channelId
    } catch (error) {
        console.error('❌ Failed to find users Voice channel:', error.message);
		return null;
    }

};

export default {
    readDiscordUsers,
    findUserVoiceChannelId
};