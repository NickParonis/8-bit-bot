import chalk from 'chalk';
import messageController from '../commands/messageController.js';
import { createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import ytdl from 'ytdl-core';

async function messageCreateHandler(client) {
    const COMMAND_PREFIX = '%';
    const TERMINAL_CHANNEL_ID = '1367078981593202740';
	let voiceConnections = new Map();

    client.on('messageCreate', async (message) => {
		console.log(
			chalk.blue(message.author.globalName) +
			chalk.white(' wrote ') +
			chalk.green(message.content)
      	);

		if (
			message.author.bot
			|| message.channel.id !== TERMINAL_CHANNEL_ID
			// || !message.content.startsWith(COMMAND_PREFIX)
		){
			return;
		}

		const command = message.content.slice(COMMAND_PREFIX.length).trim();
		const commandName = command.split(' ')[0];
		const args = command.slice(commandName.length).trim();

		if (commandName === 'readDiscordUsers') {
			await messageController.readDiscordUsers(message);
		}

		if (commandName === 'test') {
			messageController.testBot(message);
		}

		if (commandName === 'chat') {
			await messageController.chatBot(message, args);
		}

		if (commandName === 'join') {
			if (voiceConnections.has(message.guild.id)) {
				message.reply('Already connected to the voice channel!');
				return;
			}

			const connection = await messageController.connectUser(message);
			if (connection) {
				subscribePlayer(connection, message.guild.id);
			}
		}

		if (commandName === 'play') {
			let stored = voiceConnections.get(message.guild.id);
		
			if (!stored) {
				const connection = await messageController.connectUser(message);
				if (!connection) {
					message.reply('Failed to join voice channel!');
					return;
				}
				subscribePlayer(connection, message.guild.id)
				// const player = createAudioPlayer();
				// connection.subscribe(player);
				// stored = { connection, player };
				// voiceConnections.set(message.guild.id, stored);
				// message.reply('Joined voice channel automatically.');
			}
		
			await messageController.playSound(stored.connection, stored.player, args);
		}
		
		if (commandName === 'leave') {
			const stored = voiceConnections.get(message.guild.id);
			if (stored) {
				stored.connection.destroy();
				voiceConnections.delete(message.guild.id);
				message.reply('Disconnected from voice channel.');
			} else {
				message.reply('I am not in a voice channel!');
			}
		}

		// if (commandName === 'youtube') {
		// 	let stored = voiceConnections.get(message.guild.id);
		
		// 	if (!stored) {
		// 		const connection = await messageController.joinUser(message);
		// 		if (!connection) {
		// 			message.reply('Failed to join voice channel!');
		// 			return;
		// 		}
		// 		const player = createAudioPlayer();
		// 		connection.subscribe(player);
		// 		stored = { connection, player };
		// 		voiceConnections.set(message.guild.id, stored);
		// 		message.reply('Joined voice channel automatically.');
		// 	}
		
		// 	const youtubeURL = args;
		
		// 	if (!ytdl.validateURL(youtubeURL)) {
		// 		message.reply('Invalid YouTube URL!');
		// 		return;
		// 	}
		
		// 	try {
		// 		const stream = ytdl(youtubeURL, {
		// 			filter: 'audioonly',
		// 			quality: 'highestaudio',
		// 			highWaterMark: 1 << 25
		// 		});
		
		// 		const resource = createAudioResource(stream);
		
		// 		stored.player.play(resource);
		
		// 		message.reply(`Now playing: ${youtubeURL}`);
		
		// 		stored.player.once(AudioPlayerStatus.Idle, () => {
		// 			message.channel.send('Finished playing!');
		// 		});
		
		// 		stored.player.on('error', (error) => {
		// 			console.error('Error in audio player:', error);
		// 			stored.connection.destroy();
		// 			voiceConnections.delete(message.guild.id);
		// 			message.channel.send('Playback error occurred. Disconnected from voice channel.');
		// 		});
		
		// 	} catch (error) {
		// 		console.error('Failed to play YouTube audio:', error);
		// 		message.reply('An error occurred while trying to play the YouTube audio.');
		// 	}
		// }
    });

	const subscribePlayer = (connection, guildId) => {
		let player = createAudioPlayer();
		connection.subscribe(player);
		let stored = { connection, player };
		voiceConnections.set(guildId, stored);
	}
}

export default {
  	messageCreateHandler
};