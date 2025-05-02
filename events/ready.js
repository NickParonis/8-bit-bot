import path from 'path';
import fs from 'fs';

export function readyHandler(client) {
  client.once('ready', () => {
    // const imagePath = path.join(path.dirname(''), 'sources', 'avatar.png');

    // try {
    //   const avatar = fs.readFileSync(imagePath);
    //   client.user.setAvatar(avatar)
    //     .then(() => {
    //       console.log('Bot avatar has been successfully set!');
    //     })
    //     .catch(console.error);
    // } catch (error) {
    //   console.error('Error reading avatar file:', error);
    // }

    console.log(`✅ Logged in as ${client.user.tag}`);
  });
}