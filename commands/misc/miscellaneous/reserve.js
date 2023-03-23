const {  EmbedBuilder, Colors } = require('discord.js');
module.exports = async (interaction) => {
    const success = new EmbedBuilder()
        .setTitle(`✅予約送信`)
        .setDescription(`${interaction.options.getString("content")}\nを${interaction.options.getInteger("secound")}秒後に送信します。`)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | reserve" })
        .setColor(Colors.Green);
    await interaction.reply({ embeds: [success], ephemeral: true });
    setTimeout(async () => {
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.tag}の予約送信`)
            .setDescription(`${interaction.options.getString("content")}`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | reserve" })
            .setColor(Colors.Green);
        await interaction.channel.send({ embeds: [embed], ephemeral: true });
    }, interaction.options.getInteger("secound") * 1000);
};