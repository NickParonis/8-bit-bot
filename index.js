import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import messageHandler from './handlers/messageHandler.js';
import buttonHandler from './handlers/buttonHandler.js';
import ready from './handlers/readyHandler.js';

dotenv.config();
const TOKEN = process.env.TOKEN;

const voiceSessions = new Map();
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
	]
});

// Initialize handlers
ready.readyHandler(client);
messageHandler.messageHandler(client, voiceSessions);
buttonHandler.buttonHandler(client, voiceSessions);

client.login(TOKEN);