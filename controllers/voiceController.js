import voiceService from '../services/voiceService.js';


async function createVoiceSession(interaction, channelId) {
	let connection;

	try {
		connection = await voiceService.connectToChannel(interaction.guild, channelId);
		const player = voiceService.createPlayer();
		connection.subscribe(player);
		return {connection, player};
	} catch (error) {
		console.error('❌ Failed to create voice session:', error.message);
		if (connection) {
			connection.destroy();
			console.log('🧹 Destroyed incomplete connection.');
		}

		await interaction.reply({
			content: 'Failed to join your channel: ' + error.message,
			ephemeral: true
		});
		return null;
	}
};

async function playSound(voiceSession, fileName) {
	try {
		await voiceService.playAudioFile(voiceSession, fileName);
	} catch (error) {
		console.error('Controller: playSound failed', error);
		await voiceSession.connection.destroy();
	}
};


export default {
	createVoiceSession,
	playSound
};