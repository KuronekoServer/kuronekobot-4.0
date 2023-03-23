const { EmbedBuilder, Colors } = require("discord.js");
const permissonerror = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription(`BANを解除できませんでした。\n理由:権限不足`)
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | unban" });
const alreadyerror = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription(`BANを解除できませんでした。\n理由:すでに解除されています`)
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | unban" });
const unknownerror = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription(`BANを解除できませんでした。\n理由:ユーザーが見つかりません`)
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | unban" });
module.exports = async (interaction) => {
    const id = interaction.options.getString("memberid");
    interaction.guild.members.unban(id)
        .then(async (user) => {
            const success = new EmbedBuilder()
                .setTitle("✅成功")
                .setDescription(`${user}のBANを解除しました`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | unban" })
                .setColor(Colors.Green);
            await interaction.reply({ embeds: [success], ephemeral: true });
        })
        .catch(async ex => {
            if (ex.code === 50013) return await interaction.reply({ embeds: [permissonerror], ephemeral: true });
            if (ex.code === 50035) return await interaction.reply({ embeds: [unknownerror], ephemeral: true });
            if (ex.code === 10026) return await interaction.reply({ embeds: [alreadyerror], ephemeral: true });
            const kickerror = new EmbedBuilder()
                .setTitle("⚠️エラー")
                .setDescription(`BANを解除できませんでした。\n詳細:${ex}`)
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | unban" });
            await interaction.reply({ embeds: [kickerror], ephemeral: true });
        });
};