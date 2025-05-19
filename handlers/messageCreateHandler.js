import chalk from 'chalk';
import messageController from '../commands/messageController.js';
import { createAudioPlayer, createAudioResource, AudioPlayerStatus } from '@discordjs/voice';
import { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder } from 'discord.js';
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
			// || message.channel.id !== TERMINAL_CHANNEL_ID
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

			const connection = await messageController.connectToChannel(message.guild, message.author.id);
			if (connection) {
				subscribePlayer(connection, message.guild.id);
			}
		}

		if (commandName === 'play') {
			let stored = voiceConnections.get(message.guild.id);
		
			if (!stored) {
				const connection = await messageController.connectToChannel(message.guild, message.author.id);
				if (!connection) {
					message.reply('Failed to join voice channel!');
					return;
				}
				subscribePlayer(connection, message.guild.id)
				stored = voiceConnections.get(message.guild.id);
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

		if (commandName === 'b') {
			const voiceEffectButtons = [
			{ id: 'demacia', label: '🔊 demacia', style: ButtonStyle.Secondary },
			{ id: 'drum', label: '🔊 drum', style: ButtonStyle.Secondary },
			{ id: 'fart', label: '🔊 fart', style: ButtonStyle.Secondary },
			{ id: 'horse1', label: '🔊 horse1', style: ButtonStyle.Secondary },
			{ id: 'horse2', label: '🔊 horse2', style: ButtonStyle.Secondary },
			{ id: 'horse3', label: '🔊 horse3', style: ButtonStyle.Secondary },
			{ id: 'horse4', label: '🔊 horse4', style: ButtonStyle.Secondary },
			{ id: 'mounoskilo', label: '🔊 mounoskilo', style: ButtonStyle.Secondary },
			{ id: 'tsakonas', label: '🔊 tsakonas', style: ButtonStyle.Secondary },
			{ id: 'leave', label: '🔊 leave', style: ButtonStyle.Danger },
			];

			// Group buttons into rows of 5 max
			const rows = [];
			for (let i = 0; i < voiceEffectButtons.length; i += 5) {
				const row = new ActionRowBuilder();
				const chunk = voiceEffectButtons.slice(i, i + 5);
				chunk.forEach(button =>
					row.addComponents(
					new ButtonBuilder()
						.setCustomId(button.id)
						.setLabel(button.label)
						.setStyle(button.style)
					)
				);
				rows.push(row);
			}
		
			await message.channel.send({
				content: '**🎵 Sound Effects 🎵**',
				components: rows,
			});
		}

		if (commandName === 'a') {
			const sounds = [
				{ id: 'demacia', label: 'Demacia' },
				{ id: 'drum', label: 'Drum Roll' },
				{ id: 'fart', label: 'Fart Noise' },
			];
			
			for (const sound of sounds) {
				const embed = new EmbedBuilder()
					.setColor(0x00AE86)
					.setTitle(`🎵 ${sound.label}`)
					.setDescription(`Click the button below to play the **${sound.label}** sound.`)
					.setThumbnail('https://i.imgur.com/some-image.png'); // optional
			
				const row = new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId(sound.id)
						.setLabel(`▶️ Play ${sound.label}`)
						.setStyle(ButtonStyle.Primary)
				);
			
				await message.channel.send({
					embeds: [embed],
					components: [row],
				});
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

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isButton()) return;
		let stored = voiceConnections.get(interaction.guild.id);
	
		if (!stored) {
			const connection = await messageController.connectToChannel(interaction.guild, interaction.user.id);
			if (!connection) {
				console.log('Failed to join voice channel!');
				return;
			};
			subscribePlayer(connection, interaction.guild.id);
			stored = voiceConnections.get(interaction.guild.id);
		}

		await interaction.deferUpdate();
		await messageController.playSound(stored.connection, stored.player, interaction.customId);
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