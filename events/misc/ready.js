const { Events } = require('discord.js');
const chalk = require('chalk');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        client.user.setActivity(`/help `, {
            type: 'PLAYING',
        });
        console.log(chalk.green('[成功]'), `${client.user.tag}にログインしました。`)
    }
}