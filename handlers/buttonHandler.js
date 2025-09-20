import voiceController from '../controllers/voiceController.js';
import userController from '../controllers/userController.js';
import voiceUtils from '../helpers/voiceHelper.js';
import { Events } from 'discord.js';


async function buttonHandler(client, voiceSessions) {
	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isButton()) return;

		const [command, ...args] = interaction.customId.split("_");
		let userId = interaction.user.id;
		let channelId = await userController.findUserVoiceChannelId(interaction.guild, userId);
		let storedVoiceSession;
		switch (command) {
			case 'playSound':
				storedVoiceSession = await voiceUtils.getOrCreateVoiceSession(interaction, channelId, voiceSessions);
				if (!storedVoiceSession) break;

				const fileName = args.join("_"); // to handle names with underscores
				await voiceController.playSound(storedVoiceSession, fileName);
				interaction.deferUpdate();
				break;
	
			case 'joinChannel':
				channelId = await userController.findUserVoiceChannelId(interaction.guild, userId);
				storedVoiceSession = await voiceUtils.getOrCreateVoiceSession(interaction, channelId, voiceSessions);
				interaction.deferUpdate();
				break;

			case 'leaveChannel':
				channelId = await userController.findUserVoiceChannelId(interaction.guild, userId);
				storedVoiceSession = voiceSessions.get(channelId);
				if (storedVoiceSession) {
					storedVoiceSession.connection.destroy();
					voiceSessions.delete(channelId);
					console.log('Disconnected from voice channel.');
				} else {
					console.log('I am not in a voice channel!');
				}
				interaction.deferUpdate();
				break;
			
			default:
				console.log('Unknown command in customId:', command);
		};	
	});
};

export default {
    buttonHandler
};