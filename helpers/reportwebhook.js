const { WebhookClient, Colors } = require('discord.js');
const webhookClient = new WebhookClient({ id: process.env.reportwebhook_id, token: process.env.reportwebhook_token });


module.exports = {
    async send(data) {
        await webhookClient.send({ embeds: [{ title: data.title, description: data.description, color: Colors.Green }] }).catch((ex) => { });
    }
}