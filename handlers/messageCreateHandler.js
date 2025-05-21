import messageController from '../controllers/messageController.js';
import { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, Events } from 'discord.js';
import userController from '../controllers/userController.js';


async function messageCreateHandler(client) {
    const COMMAND_PREFIX = '%';
    // const TERMINAL_CHANNEL_ID = '1367078981593202740';
	let voiceSessions = new Map();

    client.on(Events.MessageCreate, async (message) => {
		if (
			message.author.bot
			// || message.channel.id !== TERMINAL_CHANNEL_ID
			|| !message.content.startsWith(COMMAND_PREFIX)
		){
			return;
		}

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

		// if (commandName === 'play') {
		// 	let storedVoiceSession = voiceSessions.get(message.guild.id);
		
		// 	if (!storedVoiceSession) {
		// 		const voiceSession = await messageController.createVoiceSession(message.guild, message.author.id);
		// 		if (!voiceSession) {
		// 			message.reply('Failed to join voice channel!');
		// 			return;
		// 		}
		// 		voiceSessions.set(voiceSession.guildId, voiceSession.connectionData);
		// 		storedVoiceSession = voiceSession.connectionData;
		// 	}
		
		// 	await messageController.playSound(storedVoiceSession, args);
		// }
		
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


				const buttonGroups = [
					[
					  { id: 'demacia', label: '🔊 demacia', style: ButtonStyle.Secondary },
					  { id: 'drum', label: '🔊 drum', style: ButtonStyle.Secondary },
					  { id: 'fart', label: '🔊 FartHD', style: ButtonStyle.Secondary },
					],
					[
					  { id: 'horse1', label: '🔊 horse1', style: ButtonStyle.Secondary },
					  { id: 'horse2', label: '🔊 horse2', style: ButtonStyle.Secondary },
					  { id: 'horse3', label: '🔊 horse3', style: ButtonStyle.Secondary },
					],
					[
					  { id: 'leave', label: 'Leave', style: ButtonStyle.Danger },
					],
				  ];
				  
				  for (const group of buttonGroups) {
					// Create embed for this group (you can customize title/description per group)
					const embed = new EmbedBuilder()
					  .setTitle('🎤 Voice Connection Error') // Customize if needed per group
					  .setDescription('The bot failed to join your voice channel. Please check permissions or try again.')
					  .setColor('Red')
					  .setFooter({ text: 'Choose an option below:' });
				  
					// Create one action row for each button in the group
					// Note: Each ActionRow can have max 5 buttons, so if group has >5 buttons, split into multiple rows
					const rows = [];
					for (let i = 0; i < group.length; i += 5) {
					  const row = new ActionRowBuilder();
					  const chunk = group.slice(i, i + 5);
					  for (const btn of chunk) {
						row.addComponents(
						  new ButtonBuilder()
							.setCustomId(btn.id)
							.setLabel(btn.label)
							.setStyle(btn.style)
						);
					  }
					  rows.push(row);
					}
				  
					// Send the embed + all button rows for this group
					await message.channel.send({
					  embeds: [embed],
					  components: rows,
					});
				  }
				// const voiceEffectButtons = [
				// 	{ id: 'demacia', label: '🔊 demacia', style: ButtonStyle.Secondary },
				// 	{ id: 'drum', label: '🔊 drum', style: ButtonStyle.Secondary },
				// 	{ id: 'fart', label: '🔊 FartHD', style: ButtonStyle.Secondary },
				// 	{ id: 'horse1', label: '🔊 horse1', style: ButtonStyle.Secondary },
				// 	{ id: 'horse2', label: '🔊 horse2', style: ButtonStyle.Secondary },
				// 	{ id: 'horse3', label: '🔊 horse3', style: ButtonStyle.Secondary },
				// 	{ id: 'horse4', label: '🔊 horse4', style: ButtonStyle.Secondary },
				// 	{ id: 'mounoskilo', label: '🔊 mounoskilo', style: ButtonStyle.Secondary },
				// 	{ id: 'tsakonas', label: '🔊 tsakonas', style: ButtonStyle.Secondary },
				// 	{ id: 'leave', label: '🔊 leave', style: ButtonStyle.Danger },
				// ];


				// for (const buttonDef of voiceEffectButtons) {
				// 	const content = `➡️ **${buttonDef.label}**`;

				// 	const row = new ActionRowBuilder().addComponents(
				// 	new ButtonBuilder()
				// 		.setCustomId(buttonDef.id)
				// 		.setLabel(buttonDef.label)
				// 		.setStyle(buttonDef.style)
				// 	);

				// 	await message.channel.send({
				// 	content,
				// 	components: [row],
				// 	});
				// }

		
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