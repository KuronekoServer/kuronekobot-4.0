const { WebhookClient, Colors, Events } = require("discord.js");
const { CustomEmbed } = require("../../libs");

const webhook = new WebhookClient({ url: process.env.reportwebhookurl });

module.exports = {
    name: Events.InteractionCreate,
    filter: (i) => i.isModalSubmit() && i.customId === "report",
    async execute(interaction) {
        const title = interaction.fields.getTextInputValue("title");
        const description = interaction.fields.getTextInputValue("description");

        const reportEmbed = new CustomEmbed("report")
            .setTitle(title)
            .setDescription(description)
            .setColor(Colors.Orange);
        webhook.send({ embeds: [reportEmbed] });
        
        const embed = new CustomEmbed("report").typeSuccess().setDescription("レポートが送信されました。");
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};