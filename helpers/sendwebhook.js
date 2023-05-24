const { WebhookClient } = require("discord.js");
const config = require("../config");
const webhookClient = new WebhookClient({ url: config.webhook.error });

module.exports = {
    async send(error) {
        await webhookClient.send({ embeds: [{ title: error.title, description: "```" + error.description + "```", color: error.color, timestamp: error.time }] }).catch((erx) => { });
    }
}