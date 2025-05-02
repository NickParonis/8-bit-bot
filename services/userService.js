import path from 'path';
import fs from 'fs';

const usersFilePath = path.join(process.cwd(), 'DB', 'users.json');

// Read all users data
export function readDatabaseUsers() {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
}

export async function readCurrentUsers(guild) {
	try {
	  const membersInfo = [];
  
	  // Fetch all members of the guild
	  const members = await guild.members.fetch();
  
	  // Add each member's ID and name to the array
	  for (const member of members.values()) {
		membersInfo.push({
		  id: member.id,
		  globalName: member.user.globalName,
		  name: member.user.username  // member.user.username gives the username of the member
		});
	  }
  
	  // Return the array of objects containing user IDs and names
	  return membersInfo;
	} catch (error) {
	  console.error('Error fetching members:', error);
	  throw new Error('Unable to fetch user IDs and names.');
	}
  }

// Write updated users data to the JSON file
export function writeUsers(data) {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Add or update a user
export function addOrUpdateUser(userId, name, gold) {
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

// Get a user by ID
export function getUser(userId) {
  const users = readUsers();
  return users[userId] || null;
}