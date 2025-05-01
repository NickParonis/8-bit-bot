const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const TOKEN = process.env.TOKEN; // Paste your bot token here
const fs = require('fs');
const path = require('path');
const client = new Client({
	intents: [
	  GatewayIntentBits.Guilds,
	  GatewayIntentBits.GuildMessages,
	  GatewayIntentBits.MessageContent
	]
  });

  
const messageCreateHandler = require('./events/messageCreate');
const readyHandler = require('./events/ready');


readyHandler(client);
messageCreateHandler(client);

const usersFilePath = path.join(__dirname, 'DB', 'users.json');


// CRUD
function readUsers() {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
}

// Write updated users data to the JSON file
function writeUsers(data) {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Add a new user or update an existing user
function addOrUpdateUser(userId, name, gold) {
  const users = readUsers();

  // If the user already exists, update their gold and name (if different)
  if (users[userId]) {
    users[userId].gold += gold;
    if (users[userId].name !== name) {
      users[userId].name = name;  // Update the name if it changed
    }
  } else {
    // Otherwise, create a new entry for the user
    users[userId] = { name, gold };
  }

  writeUsers(users);
}

function getUser(userId) {
  const users = readUsers();
  return users[userId] || null;
}

var users = readUsers();


//events
client.once('ready', () => {

  });



client.on('messageCreate', (message) => {
  if (!message.author.bot) {
  }
});
    
client.login(TOKEN);