const { EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = async (interaction) => {
    const message = interaction.options.getInteger("message");
    const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`clear${message}`)
                .setLabel("削除する")
                .setStyle(ButtonStyle.Danger),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`clearcancel`)
                .setLabel("キャンセルする")
                .setStyle(ButtonStyle.Secondary),
        );
    const clear_check = new EmbedBuilder()
        .setTitle("⚠️確認")
        .setDescription(`${(message === 0) ? "すべてのメッセージ" : `${message}件のメッセージ`}を削除しますか?`)
        .setColor(Colors.Red)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | kick" });
    await interaction.reply({ embeds: [clear_check], components: [button] });
};