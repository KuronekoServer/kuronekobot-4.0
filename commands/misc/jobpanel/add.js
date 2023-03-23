const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const basic_emojis = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷'];
const error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("パネルが選択されていません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
const react_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("選択されたリアクションはつけることができません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("正常にパネルが作成されました。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
    .setColor(Colors.Green);
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("パネルの選択更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" });
module.exports = async (interaction) => {
    //可読性皆無(すまん)
    const getdata = await sql(`select * from job_message where guildid="${interaction.guild.id}";`);
    if (!getdata[0]?.guildid) return ({ embeds: [error], ephemeral: true });
    const channel = await interaction.guild.channels.fetch(getdata[0].channelid).catch((ex) => { });
    if (!channel) return ({ embeds: [error], ephemeral: true });
    const msg = await channel.messages.fetch(getdata[0].messageid).catch((ex) => { });
    if (!msg) return ({ embeds: [error], ephemeral: true });
    const option = interaction.options;
    const old_roles = msg.embeds[0]?.data?.description.split("\n").map(content => (content.split(/:<@&(.+)>/)[1]?.match(/\d+/g)[0]) ? content.split(/:<@&(.+)>/)[1]?.match(/\d+/g)[0] : content.split(":")[1]);
    const old_emojis = msg.embeds[0]?.data?.description.split("\n").map(content => (content.split(/:<@&(.+)>/)[0]) ? content.split(/:<@&(.+)>/)[0] : content.split(":")[0]);
    const new_roles = (option._hoistedOptions.filter(content => content?.name?.includes("role"))).map(role => role.value);
    const new_emojis = (option._hoistedOptions.filter(content => content?.name?.includes("emoji"))).map(emoji => emoji.value);
    if (old_emojis.some(emoji => new_emojis.includes(emoji))) return ({ embeds: [react_error], ephemeral: true });
    const roles = old_roles.concat(new_roles);
    let emojis = ((new_emojis.length == 0) ? [...new Set(old_emojis.concat(basic_emojis))] : [...new Set(old_emojis.concat(new_emojis).concat(basic_emojis))]).slice(0, roles.length);
    if (roles.length > basic_emojis.length) {
        for (const emoji of emojis.slice(0, basic_emojis.length)) {
            const check = await msg.react(emoji).catch(ex => { });
            if (!check) return ({ embeds: [react_error], ephemeral: true });
        };
        const edit = new EmbedBuilder()
            .setTitle(msg.embeds[0]?.data?.title || "役職パネル")
            .setDescription(roles.slice(0, basic_emojis.length).map((role, index) => `${emojis[index]}:${interaction.guild.roles.cache.get(role) || role}`).join('\n'))
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
            .setImage(msg.embeds[0]?.data?.image?.url || null)
            .setColor(msg.embeds[0]?.data?.color || Colors.Green);
        await msg.edit({
            embeds: [edit]
        });
        emojis = [...new Set(emojis.slice(basic_emojis.length).concat(basic_emojis))]
        const content = new EmbedBuilder()
            .setTitle(msg.embeds[0]?.data?.title || "役職パネル")
            .setDescription(roles.slice(basic_emojis.length).map((role, index) => `${emojis[index]}:${interaction.guild.roles.cache.get(role) || role}`).join('\n'))
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
            .setImage(msg.embeds[0]?.data?.image?.url || null)
            .setColor(msg.embeds[0]?.data?.color || Colors.Green);
        const new_msg = await msg.channel.send({
            embeds: [content]
        });
        for (const emoji of emojis.slice(basic_emojis, roles.slice(basic_emojis.length).length)) {
            const check = await new_msg.react(emoji).catch(ex => { });
            if (!check) {
                await new_msg.delete();
                return ({ embeds: [react_error], ephemeral: true });
            };
            const update = await sql(`update job_message set messageid="${new_msg.id}",channelid="${new_msg.channel.id}" where guildid="${interaction.guild.id}";`);
            if (!update) return ({ embeds: [db_error], ephemeral: true });
        };
    } else {
        const edit = new EmbedBuilder()
            .setTitle(msg.embeds[0]?.data?.title || "役職パネル")
            .setDescription(roles.map((role, index) => `${emojis[index]}:${interaction.guild.roles.cache.get(role) || role}`).join('\n'))
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
            .setImage(msg.embeds[0]?.data?.image?.url || null)
            .setColor(msg.embeds[0]?.data?.color || Colors.Green);
        for (const emoji of emojis) {
            const check = await msg.react(emoji).catch(ex => { });
            if (!check) return ({ embeds: [react_error], ephemeral: true });
        };
        await msg.edit({
            embeds: [edit]
        });
    }
    return ({ embeds: [success], ephemeral: true });
};