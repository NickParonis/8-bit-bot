import userService from '../services/userService.js';
import fetch from 'node-fetch';
import { 
	joinVoiceChannel, 
	createAudioResource, 
	entersState, 
	VoiceConnectionStatus, 
	AudioPlayerStatus,
	demuxProbe
  } from '@discordjs/voice';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createReadStream } from 'fs';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



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

async function chatBot(message, botMessage) {
	const HF_API_URL = 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-llm-7b-instruct';
	console.log('API KEY:', process.env.HUGGINGFACE_API_KEY);
	try {
		const response = await fetch(HF_API_URL, {
			method: 'POST',
			headers: {
			  Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  inputs: botMessage,
			}),
		});
		  
		if (!response.ok) {
			const errorText = await response.text();
			console.error(`HTTP error! Status: ${response.status}`);
			console.error(`API response body: ${errorText}`);
			await message.reply(`❌ API returned HTTP ${response.status}: ${errorText}`);
			return;
		}
		  
		const data = await response.json();
		  
		if (data.error) {
			console.error('API Error:', data.error);
			await message.reply('❌ Error from AI API: ' + data.error);
		} else {
			const aiReply = Array.isArray(data) && data.length > 0 && data[0].generated_text
			  ? data[0].generated_text
			  : '🤷 No response from AI.';
			await message.reply(aiReply);
		}
	} catch (error) {
		console.error('Fetch error:', error);
		await message.reply('❌ Failed to contact AI API.');
	}
};

async function connectToChannel(guild, userId){
	const channelId = await userService.findUserVoiceChannelId(guild, userId);
	if (channelId) {
		const connection = joinVoiceChannel({
			channelId: channelId,
			guildId: guild.id, // 📝 FIX: it’s message.guild.id (not guildId)
			adapterCreator: guild.voiceAdapterCreator,
			selfDeaf: false
		});

		try {
			console.log('Current connection state:', connection.state.status);
			await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
			console.log('✅ Bot successfully joined voice channel!');
			return connection;
		} catch (error) {
			console.error('❌ Failed to join voice channel within 30 seconds:', error);
			connection.destroy();
			return null;
		}
	} else {
		console.log(`You're not currently in a voice channel.`);
		return null;
	}
}

async function playSound(storedConnection, storedPlayer, fileName) {
	try {
		var file = fileName + ".wav";
		const filePath = path.resolve(__dirname, '..', 'sounds', file);
		
		if (!fs.existsSync(filePath)) {
			console.error('File does not exist:', filePath);
			return;
		}

		if (storedPlayer.state.status !== AudioPlayerStatus.Idle) {
			console.log('Stopping current playback...');
			storedPlayer.stop(true);
		}

		const stream = createReadStream(filePath);

		const { stream: probedStream, type } = await demuxProbe(stream);

		if (!probedStream) {
			console.error('Failed to process audio stream');
			storedConnection.destroy();
			return;
		}

		const resource = createAudioResource(probedStream, { inputType: type });
		console.log('Audio resource created successfully:');
		storedPlayer.play(resource);

		storedPlayer.once(AudioPlayerStatus.Idle, () => {
			console.log('Finished playing!');
		});

		storedPlayer.on('error', (error) => {
			console.error('Error in audio player:', error);
			storedConnection.destroy();
		});
	} catch (error) {
		console.error('Failed to connect:', error);
		storedConnection.destroy();
	}
}

export default {
    readDiscordUsers,
	testBot,
	chatBot,
	connectToChannel,
	playSound,
};