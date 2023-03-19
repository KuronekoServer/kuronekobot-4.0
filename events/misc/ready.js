const { Events, ActivityType } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        setInterval(() => {
            client.user.setPresence({ activities: [{ name: `${globalThis.voice_channel.length}チャンネル再生中`, type: ActivityType.Streaming }] });
        }, 60 * 1000);
        console.log(chalk.green('[成功]'), `${client.user.tag}にログインしました。`)
    }
}