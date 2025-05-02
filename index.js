import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { messageCreateHandler } from './events/messageCreate.js'; // Import your messageCreateHandler function
import { readyHandler } from './events/ready.js';

dotenv.config();
const TOKEN = process.env.TOKEN; // Paste your bot token here

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers
  ]
});

// Initialize handlers
readyHandler(client);
messageCreateHandler(client);

client.login(TOKEN);