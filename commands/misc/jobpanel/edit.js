const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const { escape } = require("mysql2")

const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("正常に役職パネルが編集されました。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
    .setColor(Colors.Green);
const error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("パネルが選択されていません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });

module.exports = async (interaction) => {
    const getdata = await sql(`select * from job_message where guildid=${escape(interaction.guild.id)};`);
    if (!getdata[0][0]?.guildid) return ({ embeds: [error], ephemeral: true });
    const channel = await interaction.guild.channels.fetch(getdata[0][0]?.channelid).catch((ex) => { });
    if (!channel) return ({ embeds: [error], ephemeral: true });
    const msg = await channel.messages.fetch(getdata[0][0]?.messageid).catch((ex) => { });
    if (!msg) return ({ embeds: [error], ephemeral: true });
    const option = interaction.options;
    const old_roles = msg.embeds[0]?.data?.description.split("\n").map(content => (content.split(/:<@&(.+)>/)[1]?.match(/\d+/g)[0]) ? content.split(/:<@&(.+)>/)[1]?.match(/\d+/g)[0] : content.split(":")[1]);
    const old_emojis = msg.embeds[0]?.data?.description.split("\n").map(content => (content.split(/:<@&(.+)>/)[0]) ? content.split(/:<@&(.+)>/)[0] : content.split(":")[0]);
    const edit = new EmbedBuilder()
        .setTitle(option.getString("title") || msg.embeds[0]?.data?.title)
        .setDescription(old_roles.map((role, index) => `${old_emojis[index]}:${interaction.guild.roles.cache.get(role) || role}`).join('\n'))
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
        .setImage((option.getString("attachmentoption") == "true") ? null : option.getAttachment("image")?.attachment || msg.embeds[0]?.data?.image?.url)
        .setColor(Colors[option.getString("color")] || msg.embeds[0]?.data?.color);
    await msg.edit({ embeds: [edit] });
    return ({ embeds: [success], ephemeral: true });
};