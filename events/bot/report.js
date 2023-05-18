const { WebhookClient, Colors, Events } = require("discord.js");
const { CustomEmbed } = require("../../libs");

const reportWebhook = new WebhookClient({ url: process.env.errorwebhook });

module.exports = {
    name: Events.InteractionCreate,
    filter: (interaction) => interaction.isModalSubmit() && interaction.customId === "report",
    async execute(interaction) {
        const title = interaction.fields.getTextInputValue("title");
        const description = interaction.fields.getTextInputValue("description");

        const reportEmbed = new CustomEmbed("report")
            .setTitle(title)
            .setDescription(description)
            .setColor(Colors.Orange);
        reportWebhook.send({ embeds: [reportEmbed] });
        
        const embed = new CustomEmbed("report").typeSuccess().setDescription("レポートが送信されました。");
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
};