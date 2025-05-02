import chalk from 'chalk';
import { readCurrentUsers } from '../services/userService.js'; // Import your service

export async function messageCreateHandler(client) {
  const COMMAND_PREFIX = '%';
  const TARGET_CHANNEL_ID = '1367078981593202740';

  client.on('messageCreate', async (message) => {
    console.log(
      chalk.blue(message.author.globalName) +
      chalk.white(' wrote ') +
      chalk.green(message.content)
    );

    // Only respond if the message is from a human, in the correct channel, and starts with the command prefix
    if (
      message.author.bot ||
      message.channel.id !== TARGET_CHANNEL_ID ||
      !message.content.startsWith(COMMAND_PREFIX)
    ) {
      return;
    }

    const command = message.content.slice(COMMAND_PREFIX.length).trim();

    if (command === 'readCurrentUsers') {
      // Call the function to get all user IDs and names
      await getCurrentUsersHandler(message);
    }

    if (command === 'test') {
        // Call the function to get all user IDs and names
        message.channel.send(`Up and running`);
    }

  });
}

async function getCurrentUsersHandler(message) {
  try {
    const guild = message.guild;

    // Call the service to get all user IDs and names
    const userInfo = await readCurrentUsers(guild);

    // Log the user IDs and names to the console
    console.log('User IDs and Names:', userInfo);

    // Optionally, send the user info back to the channel
    const formattedResponse = userInfo
      .map(user => `Name: ${user.globalName} - UserName: ${user.name} - (ID: ${user.id})`)
      .join('\n');

    message.channel.send(`\n${formattedResponse}`);
  } catch (error) {
    console.error('Error while fetching user IDs and names:', error);
    message.channel.send('There was an error trying to fetch user IDs and names.');
  }
}