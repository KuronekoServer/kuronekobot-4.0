const { EmbedBuilder, Colors, Events } = require('discord.js');
const embed = new EmbedBuilder()
    .setTitle('✅完了')
    .setDescription("レポートが送信されました")
    .setColor(Colors.Green)
    .setTimestamp(new Date())
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | status" });
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.customId === "genshindelete") {
            await interaction.message.delete();
        };
    }
}