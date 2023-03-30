const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const { escape } = require("mysql2")
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const size_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("合わせて20文字以内になるようにしてください。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const before = interaction.options.getString("before");
    const after = interaction.options.getString("after");
    if (before.length + after.length > 20) return ({ embeds: [size_error] });
    const getdata = await sql(`select * from dictionary where guildid=${escape(interaction.guild.id)} and before_text=${escape(before)};`);
    if (getdata[0][0].guildid) {
        const set = await sql(`update dictionary set after_text=${escape(after)} where guildid=${escape(interaction.guild.id)} and before_text=${escape(before)};`);
        if (!set) return ({ embeds: [db_error] });
    } else {
        const set = await sql(`INSERT INTO dictionary(guildid,before_text,after_text) VALUES (${escape(interaction.guild.id)},${escape(before)},${escape(after)});`);
        if (!set) return ({ embeds: [db_error] });
    };
    const success = new EmbedBuilder()
        .setTitle(`✅完了`)
        .setDescription(`辞書を更新しました！\n単語:${before}\n読み:${after}`)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
        .setColor(Colors.Green);
    return ({ embeds: [success] });
};