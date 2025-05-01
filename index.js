const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.TOKEN; // Paste your bot token here
const TARGET_USER_ID = '148828551762804736'; // The user ID to watch
const TARGET_USER_ID2 = '718153650605654016';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  // if (message.author.id === TARGET_USER_ID && !message.author.bot) {

  //   message.reply("VOULWSETO RE SKOUPIDI");
  // }

  if (!message.author.bot) {
    // if (!message.author.bot) {
    message.reply("pes ta paiktara mou");
  }
});
    
client.login(TOKEN);