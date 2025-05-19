import path from 'path';
import fs from 'fs';

const usersFilePath = path.join(process.cwd(), 'DB', 'users.json');

// function readDatabaseUsers() {
// 	const data = fs.readFileSync(usersFilePath, 'utf-8');
// 	return JSON.parse(data);
// }

async function readCurrentUsers(guild) {
	try {
		const membersInfo = [];
		const members = await guild.members.fetch();

		for (const member of members.values()) {
			membersInfo.push({
				id: member.id,
				globalName: member.user.globalName,
				name: member.user.username
			});
		}
	return membersInfo;
	} catch (error) {
		console.error('Error fetching members:', error);
		throw new Error('Unable to fetch user IDs and names.');
	}
}

// function writeUsers(data) {
//   	fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf-8');
// }

// function readUsers() {
//   	return readDatabaseUsers();
// }

// function addOrUpdateUser(userId, name, gold) {
// 	const users = readUsers();
// 	if (users[userId]) {
// 		users[userId].gold += gold;
// 		if (users[userId].name !== name) {
// 			users[userId].name = name;
// 		}
// 	} else {
// 		users[userId] = { name, gold };
// 	}
// 	writeUsers(users);
// }

// function getUser(userId) {
// 	const users = readUsers();
// 	return users[userId] || null;
// }

async function findUserVoiceChannelId(guild, userId) {
	const guildId = guild?.id;
	if (!guildId) return null;
	
    const member = await guild.members.fetch(userId);
    if (!member) return null;

    if (member.voice && member.voice.channel) {
        return member.voice.channel.id;
    } else {
        return null;
    }
}

export default {
	// readDatabaseUsers,
	readCurrentUsers,
	// writeUsers,
	// addOrUpdateUser,
	// getUser,
	findUserVoiceChannelId
};