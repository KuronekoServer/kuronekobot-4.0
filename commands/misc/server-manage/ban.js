const { EmbedBuilder, Colors } = require("discord.js");
module.exports = async (interaction) => {
    const user = interaction.options.getUser("member");
    const day = interaction.options.getInteger("day");
    const reason = interaction.options.getString("理由");
    const member = await interaction.guild.members.fetch(user.id);
    member.ban({ days: day, reason: reason })
        .then(async () => {
            const success = new EmbedBuilder()
                .setTitle("✅成功")
                .setDescription(`${member}をBANしました\n詳細\n期間:${day || "infinity"}日\n理由:${reason || "なし"}\n対象ユーザーのID:${member.id}`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ban" })
                .setColor(Colors.Green);
            await interaction.reply({ embeds: [success], ephemeral: true });
        })
        .catch(async ex => {
            const permissonerror = new EmbedBuilder()
                .setTitle("⚠️エラー")
                .setDescription(`${member}をBANできませんでした。\n理由:権限不足\n対象ユーザーのID:${member.id}`)
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ban" });
            if (ex.code === 50013) return await interaction.reply({ embeds: [permissonerror], ephemeral: true });
            const banerror = new EmbedBuilder()
                .setTitle("⚠️エラー")
                .setDescription(`${member}をBANできませんでした。\n詳細:${ex}\n対象ユーザーのID:${member.id}`)
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | ban" });
            await interaction.reply({ embeds: [banerror], ephemeral: true });
        });
};