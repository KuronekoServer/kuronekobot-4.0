const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("パネルのコピーに成功しました!\nこのギルドではこのパネルが選択中です。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
    .setColor(Colors.Green);
const error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("パネルが選択されていません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("パネルの選択更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
module.exports = async (interaction) => {
    const getdata = await sql(`select * from job_message where guildid="${interaction.guild.id}";`);
    if (!getdata[0]?.guildid) return ({ embeds: [error], ephemeral: true });
    const channel = await interaction.guild.channels.fetch(getdata[0].channelid).catch((ex) => { });
    if (!channel) return ({ embeds: [error], ephemeral: true });
    const msg = await channel.messages.fetch(getdata[0].messageid).catch((ex) => { });
    if (!msg) return ({ embeds: [error], ephemeral: true });
    const old_roles = msg.embeds[0]?.data?.description.split("\n").map(content => (content.split(/:<@&(.+)>/)[1]?.match(/\d+/g)[0]) ? content.split(/:<@&(.+)>/)[1]?.match(/\d+/g)[0] : content.split(":")[1]);
    const old_emojis = msg.embeds[0]?.data?.description.split("\n").map(content => (content.split(/:<@&(.+)>/)[0]) ? content.split(/:<@&(.+)>/)[0] : content.split(":")[0]);
    const edit = new EmbedBuilder()
        .setTitle(msg.embeds[0]?.data?.title || "役職パネル")
        .setDescription(old_roles.map((role, index) => `${old_emojis[index]}:${interaction.guild.roles.cache.get(role) || role}`).join('\n'))
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
        .setImage(msg.embeds[0]?.data?.image?.url || null)
        .setColor(msg.embeds[0]?.data?.color || Colors.Green);
    const new_msg = await msg.channel.send({
        embeds: [edit]
    });
    for (const emoji of old_emojis) {
        const check = await new_msg.react(emoji).catch(ex => { });
        if (!check) return ({ embeds: [react_error], ephemeral: true });
    };
    const set = await sql(`update job_message set messageid="${new_msg.id}",channelid="${new_msg.channel.id}" where guildid="${interaction.guild.id}";`);
    if (!set) return ({ embeds: [db_error], ephemeral: true });
    return ({ embeds: [success], ephemeral: true });
};