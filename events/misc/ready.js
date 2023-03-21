const { Events, ActivityType } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        setInterval(() => {
            client.user.setPresence({ activities: [{ name: `βテスト中...`, type: ActivityType.Streaming }] });
        }, 300 * 1000);
        console.log(chalk.green('[成功]'), `${client.user.tag}にログインしました。`)
    }
}