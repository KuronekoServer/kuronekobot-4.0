const { Events, ActivityType } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        await client.user.setPresence({ activities: [{ name: `${client.user.username}`, type: ActivityType.Streaming }] });
        console.log(chalk.green('[成功]'), `${client.user.tag}にログインしました。`)
    }
}