import messageController from '../controllers/messageController.js';
import userController from '../controllers/userController.js';
import { Events } from 'discord.js';


async function eventHandler(client) {
    // const TERMINAL_CHANNEL_ID = '1367078981593202740';
	let voiceSessions = new Map();

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isButton()) return;
		console.log(interaction.customId);
        // await interaction.deferUpdate();
        let userId = interaction.user.id;
        let channelId = await userController.findUserVoiceChannelId(interaction.guild, userId)
		let storedVoiceSession = voiceSessions.get(channelId);
	
		if (!storedVoiceSession) {
			const voiceSession = await messageController.createVoiceSession(interaction, channelId);
			if (!voiceSession) return console.log('Failed to join voice channel!');

			voiceSessions.set(channelId, voiceSession);
			storedVoiceSession = voiceSession;
		};


	
		await messageController.playSound(storedVoiceSession, interaction.customId);
	});

};

export default {
    eventHandler
};