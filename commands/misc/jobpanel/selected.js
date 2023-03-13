const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("パネルが選択されていません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
module.exports = async (interaction) => {
    const getdata = await sql(`select * from job_message where guildid="${interaction.guild.id}";`);
    if (!getdata[0]?.guildid) return ({ embeds: [error], ephemeral: true });
    const channel = await interaction.guild.channels.fetch(getdata[0].channelid).catch((ex) => { });
    if (!channel) return ({ embeds: [error], ephemeral: true });
    const msg = await channel.messages.fetch(getdata[0].messageid).catch((ex) => { });
    if (!msg) return ({ embeds: [error], ephemeral: true });
    const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`https://discord.com/channels/${getdata[0]?.guildid}/${getdata[0]?.channelid}/${getdata[0]?.messageid}`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
    .setColor(Colors.Green);
    return ({ embeds: [success], ephemeral: true });
};