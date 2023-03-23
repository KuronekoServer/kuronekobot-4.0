const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { sql } = require("../../../helpers/utils");
module.exports = async (interaction) => {
    const ticketdata = await sql(`select * from ticket_channel where guildid="${interaction.guild.id}";`);
    const logdata = await sql(`select * from log_channel where guildid="${interaction.guild.id}";`);
    const embed = new EmbedBuilder()
        .setTitle(`✅BOTの情報`)
        .addFields(
            { name: 'Ticketlogチャンネル', value: ticketdata[0]?.guildid ? "設定済み" : "未設定" },
            { name: 'logチャンネル', value: logdata[0]?.guildid ? "設定済み" : "未設定" },
            { name: 'サポートサーバー', value: `https://discord.gg/Y6w5Jv3EAR` }
        )
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | botinfo" })
        .setColor(Colors.Green);
    await interaction.reply({ embeds: [embed], ephemeral: true });
};