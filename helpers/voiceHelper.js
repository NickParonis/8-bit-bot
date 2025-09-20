import voiceController from '../controllers/voiceController.js';

async function getOrCreateVoiceSession(interaction, channelId, voiceSessions) {
	let session = voiceSessions.get(channelId);
	if (!session) {
		session = await voiceController.createVoiceSession(interaction, channelId);
		if (!session) {
			console.log('Failed to join voice channel!');
			return null;
		}
		voiceSessions.set(channelId, session);
	}
	return session;
};

export default {
	getOrCreateVoiceSession
};