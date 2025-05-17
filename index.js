import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import messageHandler from './handlers/messageCreateHandler.js';
import ready from './handlers/readyHandler.js';

dotenv.config();
const TOKEN = process.env.TOKEN;

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
messageHandler.messageCreateHandler(client);

client.login(TOKEN);