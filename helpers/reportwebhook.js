const { WebhookClient, Colors } = require('discord.js');
const webhookClient = new WebhookClient({ url: process.env.reportwebhook });


module.exports = {
    async send(data) {
        await webhookClient.send({ embeds: [{ title: data.title, description: data.description, color: Colors.Green }] }).catch((ex) => { });
    }
}