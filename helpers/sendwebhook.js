const { WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({ url: process.env.errorwebhook });


module.exports = {
    async send(error) {
        await webhookClient.send({ embeds: [{ title: error.title, description: "```" + error.description + "```", color: error.color, timestamp: error.time }] }).catch((erx) => { });
    }
}