const { WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({ url: process.env.errorwebhook });


module.exports = {
    async send(data) {
        await webhookClient.send({ embeds: [{ title: data.title, description: data.description }] });
    }
}