const { EmbedBuilder, Colors } = require("discord.js");
module.exports = async (interaction) => {
    const user = interaction.options.getUser("member");
    const reason = interaction.options.getString("理由");
    const member = await interaction.guild.members.fetch(user.id);
    member.kick({ reason: reason })
        .then(async () => {
            const success = new EmbedBuilder()
                .setTitle("✅成功")
                .setDescription(`${member}をKICKしました\n理由:${reason || "なし"}`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | kick" })
                .setColor(Colors.Green);
            await interaction.reply({ embeds: [success], ephemeral: true });
        })
        .catch(async ex => {
            const permissonerror = new EmbedBuilder()
                .setTitle("⚠️エラー")
                .setDescription(`${member}をKICKできませんでした。\n理由:権限不足`)
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | kick" });
            if (ex.code === 50013) return await interaction.reply({ embeds: [permissonerror], ephemeral: true });
            const kickerror = new EmbedBuilder()
                .setTitle("⚠️エラー")
                .setDescription(`${member}をKICKできませんでした。\n詳細:${ex}`)
                .setColor(Colors.Red)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | kick" });
            await interaction.reply({ embeds: [kickerror], ephemeral: true });
        });
};