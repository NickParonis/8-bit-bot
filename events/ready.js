const path = require('path');
const fs = require('fs');

module.exports = function(client) {
  client.once('ready', () => {
    // Corrected relative path to the avatar image
    const imagePath = path.join(__dirname, '..', 'sources', 'avatar.png'); // Going up one level to access 'sources'

    try {
      // Read avatar file and set the bot's avatar
      const avatar = fs.readFileSync(imagePath);
      client.user.setAvatar(avatar)
        .then(() => {
          console.log('Bot avatar has been successfully set!');
        })
        .catch(console.error);
    } catch (error) {
      console.error('Error reading avatar file:', error);
    }

    console.log(`✅ Logged in as ${client.user.tag}`);
  });
};