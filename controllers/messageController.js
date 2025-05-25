import userService from '../services/userService.js';
import voiceService from '../services/voiceService.js';

function testBot(message) {
	message.channel.send(`Up and running`);
};

// async function chatBot(message, botMessage) {
// 	const HF_API_URL = 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-llm-7b-instruct';
// 	console.log('API KEY:', process.env.HUGGINGFACE_API_KEY);
// 	try {
// 		const response = await fetch(HF_API_URL, {
// 			method: 'POST',
// 			headers: {
// 			  Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
// 			  'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({
// 			  inputs: botMessage,
// 			}),
// 		});
		  
// 		if (!response.ok) {
// 			const errorText = await response.text();
// 			console.error(`HTTP error! Status: ${response.status}`);
// 			console.error(`API response body: ${errorText}`);
// 			await message.reply(`❌ API returned HTTP ${response.status}: ${errorText}`);
// 			return;
// 		}
		  
// 		const data = await response.json();
		  
// 		if (data.error) {
// 			console.error('API Error:', data.error);
// 			await message.reply('❌ Error from AI API: ' + data.error);
// 		} else {
// 			const aiReply = Array.isArray(data) && data.length > 0 && data[0].generated_text
// 			  ? data[0].generated_text
// 			  : '🤷 No response from AI.';
// 			await message.reply(aiReply);
// 		}
// 	} catch (error) {
// 		console.error('Fetch error:', error);
// 		await message.reply('❌ Failed to contact AI API.');
// 	}
// };

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

async function joinChannel(voiceSession){
	
}

export default {
	testBot,
	createVoiceSession,
	playSound,
};