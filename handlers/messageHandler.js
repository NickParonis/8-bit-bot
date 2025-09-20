import messageController from '../controllers/voiceController.js';
import { Events } from 'discord.js';
import userController from '../controllers/userController.js';
import boardHelper from '../helpers/boardHelper.js';


async function messageHandler(client, voiceSessions) {
    const COMMAND_PREFIX = '%';
    // const TERMINAL_CHANNEL_ID = '1367078981593202740';

    client.on(Events.MessageCreate, async (message) => {
		if (message.author.bot || !message.content.startsWith(COMMAND_PREFIX)){
			return;
		};

		const command = message.content.slice(COMMAND_PREFIX.length).trim();
		const commandName = command.split(' ')[0];
		const args = command.slice(commandName.length).trim();

		switch(commandName){
			case 'readDiscordUsers':
				await userController.readDiscordUsers(message.guild);
				break;
			
			case 'join':
				if (voiceSessions.has(message.guild.id)) {
					message.reply('Already connected to the voice channel!');
					return;
				}
			
				const voiceSession = await messageController.createVoiceSession(message.guild, message.author.id);
				if (!voiceSession) {
					message.reply('Failed to join voice channel!');
					return;
				}
			
				voiceSessions.set(voiceSession.guildId, voiceSession.connectionData);
				message.reply('Connected to voice channel!');
				break;
			
			case 'leave':
				const storedVoiceSession = voiceSessions.get(message.guild.id);
				if (storedVoiceSession) {
					storedVoiceSession.connection.destroy();
					voiceSessions.delete(message.guild.id);
					message.reply('Disconnected from voice channel.');
				} else {
					message.reply('I am not in a voice channel!');
				};
				break;

			case 'createSoundBoard':
				try {
					boardHelper.createSoundBoard(message)
				} catch (error) {
					console.error('Failed to clear board messages or send new board:', error);
					await message.channel.send('Sorry, I couldn\'t update the sound effects board.');
				};
				break;
			
			default:
				console.log('Unknown command in customId:', command);
		};
    });

};

export default {
  	messageHandler
};