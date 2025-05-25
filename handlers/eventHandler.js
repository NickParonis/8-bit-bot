import messageController from '../controllers/messageController.js';
import userController from '../controllers/userController.js';
import { Events } from 'discord.js';


async function eventHandler(client) {
	let voiceSessions = new Map();

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isButton()) return;
		// console.log("inneraction id is " + interaction.customId);

		const [command, ...args] = interaction.customId.split("_");
		let userId = interaction.user.id;
		let channelId = await userController.findUserVoiceChannelId(interaction.guild, userId);
		let storedVoiceSession;
		switch (command) {
			case 'playSound':
				channelId 
				storedVoiceSession = await getOrCreateVoiceSession(interaction, channelId);
				if (!storedVoiceSession) break;
				const soundName = args.join("_"); // to handle names with underscores
				await messageController.playSound(storedVoiceSession, soundName);
				interaction.deferUpdate();
				break;
	
			case 'joinChannel':
				channelId = await userController.findUserVoiceChannelId(interaction.guild, userId);
				storedVoiceSession = await getOrCreateVoiceSession(interaction, channelId);
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

	async function getOrCreateVoiceSession(interaction, channelId) {
		let session = voiceSessions.get(channelId);
		if (!session) {
			session = await messageController.createVoiceSession(interaction, channelId);
			if (!session) {
				console.log('Failed to join voice channel!');
				return null;
			}
			voiceSessions.set(channelId, session);
		}
		return session;
	}
};

export default {
    eventHandler
};