function readyHandler(client) {
	client.once('ready', () => {
		console.log(`✅ Logged in as ${client.user.tag}`);
	});
};

export default {
	readyHandler
};