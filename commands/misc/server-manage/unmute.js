const { EmbedBuilder, Colors } = require("discord.js");
module.exports = async (interaction) => {
    const user = interaction.options.getUser("member");
    const member = await interaction.guild.members.fetch(user.id);
    await member.timeout(0);
    const success = new EmbedBuilder()
        .setTitle("✅成功")
        .setDescription(`${member}のミュートを解除しました`)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | unmute" })
        .setColor(Colors.Green);
    await interaction.reply({ embeds: [success], ephemeral: true });
};