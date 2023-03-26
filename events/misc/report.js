const { EmbedBuilder, Colors, Events } = require('discord.js');
const { send } = require("../../helpers/reportwebhook");
const embed = new EmbedBuilder()
    .setTitle('✅完了')
    .setDescription("レポートが送信されました")
    .setColor(Colors.Green)
    .setTimestamp(new Date())
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | status" });
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "report") return;
        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');
        send({ title: title, description: description });
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}