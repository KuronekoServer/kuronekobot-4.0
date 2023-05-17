const { Events, ActivityType } = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,
    filter: () => true,
    async execute(client, Log) {
        setInterval(() => {
            client.user.setPresence({ activities: [{ name: `/help`, type: ActivityType.Streaming }] });
        }, 300 * 1000);
        Log.info(`Logged in as ${client.user.tag}`);
    }
}