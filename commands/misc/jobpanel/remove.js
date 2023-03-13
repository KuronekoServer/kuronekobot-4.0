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
    .setDescription("選択肢は少なくとも一つある必要があります。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
const null_react_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("対象のロールがパネルに含まれていません。")
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
    const old_roles = msg.embeds[0]?.data?.description.split("\n").map(content => (content.split(/:<@&(.+)>/)[1]?.match(/\d+/g)[0]) ? content.split(/:<@&(.+)>/)[1]?.match(/\d+/g)[0] : content.split(":")[1]);
    const remove_roles = (option._hoistedOptions.filter(content => content?.name?.includes("role"))).map(role => role.value);
    if (!old_roles.some(element => remove_roles.includes(element))) return ({ embeds: [null_react_error], ephemeral: true });
    const content = msg.embeds[0]?.data?.description.split("\n");
    const roles = old_roles.filter(element => remove_roles.includes(element));
    const content_result = content.filter(item => {
        const id = item.match(/:<@&(.+)>/)?.[1];
        return !id || !roles.includes(id);
    });
    const emoji_result = content.filter(item => {
        const id = item.match(/:<@&(.+)>/)?.[1];
        return id && roles.includes(id);
    }).map(content => content.split(/:<@&(.+)>/)[0]);
    if (content_result.length <= 0) return ({ embeds: [remove_react_error], ephemeral: true });
    if (emoji_result.length <= 0) return ({ embeds: [remove_react_error], ephemeral: true });
    for (const emoji of emoji_result) {
        const react = await msg.reactions.cache.get(emoji);
        const check = await react?.remove().catch(ex => { });
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