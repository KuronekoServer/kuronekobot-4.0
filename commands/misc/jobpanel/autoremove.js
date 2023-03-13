const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
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
const react_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("選択されたリアクションは消すことができません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
const remove_react_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("削除する項目がありませんでした。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
module.exports = async (interaction) => {
    const getdata = await sql(`select * from job_message where guildid="${interaction.guild.id}";`);
    if (!getdata[0]?.guildid) return ({ embeds: [error], ephemeral: true });
    const channel = await interaction.guild.channels.fetch(getdata[0].channelid).catch((ex) => { });
    if (!channel) return ({ embeds: [error], ephemeral: true });
    const msg = await channel.messages.fetch(getdata[0].messageid).catch((ex) => { });
    if (!msg) return ({ embeds: [error], ephemeral: true });
    const option = interaction.options;
    const old_content = msg.embeds[0]?.data?.description.split("\n");
    const old_roles = old_content.map(content => (content.split(/:<@&(.+)>/)[1]?.match(/\d+/g)[0]) ? content.split(/:<@&(.+)>/)[1]?.match(/\d+/g)[0] : content.split(":")[1]);
    const format = await Promise.all(old_roles.map(async role => await (await interaction.guild.roles.fetch(role))?.id));
    const ids = format.filter(role => role);
    const result = old_roles.filter(element => !ids.includes(element));
    if (result.length <= 0) return ({ embeds: [remove_react_error], ephemeral: true });
    const content_result = old_content.filter(content => {
        const roleId = content.split(/:<@&(.+)>/)[1];
        return !result.includes(roleId);
    });
    const emoji_result = old_content.filter(content => {
        const roleId = content.split(/:<@&(.+)>/)[1];
        return result.includes(roleId);
    }).map(content => content.split(/:<@&(.+)>/)[0]);
    for (const emoji of emoji_result) {
        const react = await msg.reactions.cache.get(emoji);
        const check = await react.remove().catch(ex => { });
        if (!check) return ({ embeds: [react_error], ephemeral: true });
    };
    const edit = new EmbedBuilder()
        .setTitle(option.getString("title") || msg.embeds[0]?.data?.title)
        .setDescription(content_result.map(content => content).join('\n'))
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
        .setImage((option.getString("attachmentoption") == "true") ? null : option.getAttachment("image")?.attachment || msg.embeds[0]?.data?.image?.url)
        .setColor(Colors[option.getString("color")] || msg.embeds[0]?.data?.color);
    await msg.edit({ embeds: [edit] });
    return ({ embeds: [success], ephemeral: true });
};