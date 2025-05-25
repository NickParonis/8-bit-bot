import messageController from '../controllers/messageController.js';
import { AttachmentBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, Events } from 'discord.js';
import userController from '../controllers/userController.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function messageCreateHandler(client) {
    const COMMAND_PREFIX = '%';
    // const TERMINAL_CHANNEL_ID = '1367078981593202740';
	let voiceSessions = new Map();
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

    client.on(Events.MessageCreate, async (message) => {
		if (
			message.author.bot
			// || message.channel.id !== TERMINAL_CHANNEL_ID
			|| !message.content.startsWith(COMMAND_PREFIX)
		){return;}

		const command = message.content.slice(COMMAND_PREFIX.length).trim();
		const commandName = command.split(' ')[0];
		const args = command.slice(commandName.length).trim();

		if (commandName === 'readDiscordUsers') {
			await userController.readDiscordUsers(message);
		}

		if (commandName === 'test') {
			messageController.testBot(message);
		}

		if (commandName === 'chat') {
			await messageController.chatBot(message, args);
		}

		if (commandName === 'join') {
			if (voiceSessions.has(message.guild.id)) {
				message.reply('Already connected to the voice channel!');
				return;
			}
		
			const voiceSession = await messageController.createVoiceSession(message.guild, message.author.id);
			if (!voiceSession) {
				message.reply('Failed to join voice channel!');
				return;
			}
		
			voiceSessions.set(voiceSession.guildId, voiceSession.connectionData);
			message.reply('Connected to voice channel!');
		}
		
		if (commandName === 'leave') {
			const storedVoiceSession = voiceSessions.get(message.guild.id);
			if (storedVoiceSession) {
				storedVoiceSession.connection.destroy();
				voiceSessions.delete(message.guild.id);
				message.reply('Disconnected from voice channel.');
			} else {
				message.reply('I am not in a voice channel!');
			}
		}

		if (commandName === 'createBoard') {
			try {

				const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
				await message.channel.bulkDelete(fetchedMessages, true);

				const jsonPath = path.join(__dirname, '../content/soundEffectBoard.json');
				const rawData = fs.readFileSync(jsonPath, 'utf8');
				const soundEffectBoard = JSON.parse(rawData);
				  
				for (const group of soundEffectBoard) {

					const bannerPath = path.join(__dirname, '../content/img', group.embed.BannerImageName);
					const thumbPath = path.join(__dirname, '../content/img', group.embed.ThumbnailImageName);

					// each groop displays/sends in message channel 1 embed and rows of up to 5 buttons
					const embed = new EmbedBuilder()
						.setTitle(group.embed.title)
						.setDescription(group.embed.description)
						.setColor(group.embed.Color)
						.setFooter({ text: '\u200B' }); // Invisible footer
				  

					const files = [];	
					if (group.embed.BannerImageName) {
						embed.setImage(`attachment://${group.embed.BannerImageName}`);
						const bannerPath = path.join(__dirname, '../content/img', group.embed.BannerImageName);
						files.push(new AttachmentBuilder(bannerPath, { name: group.embed.BannerImageName }));
					}
					
					if (group.embed.ThumbnailImageName) {
						embed.setThumbnail(`attachment://${group.embed.ThumbnailImageName}`);
						const thumbPath = path.join(__dirname, '../content/img', group.embed.ThumbnailImageName);
						files.push(new AttachmentBuilder(thumbPath, { name: group.embed.ThumbnailImageName }));
					}

					const rows = [];
					for (let i = 0; i < group.buttons.length; i += 5) {
						const row = new ActionRowBuilder();
						const chunk = group.buttons.slice(i, i + 5);
					
						chunk.forEach(btn => {
							row.addComponents(new ButtonBuilder()
								.setCustomId(btn.id)
								.setLabel(btn.label)
								.setStyle(ButtonStyle[btn.style]) 
							);
						});
				
					  	rows.push(row);
					};


					await message.channel.send({
						embeds: [embed],
						components: rows,
						files: files,
					});
					await message.channel.send({ content: '\u200B' });
				}

			} catch (error) {
				console.error('Failed to clear board messages or send new board:', error);
				await message.channel.send('Sorry, I couldn\'t update the sound effects board.');
			}
		}

    });

};

export default {
  	messageCreateHandler
};