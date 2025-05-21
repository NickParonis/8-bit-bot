import userService from './userService.js'
import { createAudioPlayer } from '@discordjs/voice';
import { 
	joinVoiceChannel, 
	entersState, 
	VoiceConnectionStatus,
    createAudioResource, 
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

async function connectToChannel(guild, channelId) {
	if (!channelId) {
		throw new Error("User is not in a voice channel.");
	};

	const connection = joinVoiceChannel({
		channelId,
		guildId: guild.id,
		adapterCreator: guild.voiceAdapterCreator,
		selfDeaf: false
	});

	await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
	return connection;
}

function createPlayer(){
    let player = createAudioPlayer();
    return player;
};

async function playAudioFile(voiceSession, fileName) {
	const file = fileName + ".wav";
	const filePath = path.resolve(__dirname, '..', 'sounds', file);

	if (!fs.existsSync(filePath)) {
		throw new Error(`File does not exist: ${filePath}`);
	};

	if (voiceSession.player.state.status !== AudioPlayerStatus.Idle) {
		voiceSession.player.stop(true);
	};

	const stream = createReadStream(filePath);
	const { stream: probedStream, type } = await demuxProbe(stream);

	if (!probedStream) {
		throw new Error('Failed to process audio stream');
	};

	const resource = createAudioResource(probedStream, { inputType: type });
	voiceSession.player.play(resource);

	voiceSession.player.once(AudioPlayerStatus.Idle, () => {
		console.log(`Finished playing: ${file}`);
	});

	voiceSession.player.on('error', (error) => {
		console.error('Audio player error:', error);
	});
};

export default {
    connectToChannel,
    playAudioFile,
    createPlayer
};