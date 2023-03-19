const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const quotation = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("単語削除にダブルクォーテーションがは使えません。")
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
    if (before?.includes('"')) return ({ embeds: [quotation], ephemeral: true });
    if (after?.includes('"')) return ({ embeds: [quotation], ephemeral: true });
    if (before.length + after.length > 20) return ({ embeds: [size_error], ephemeral: true });
    const getdata = await sql(`select * from dictionary where guildid="${interaction.guild.id}" and before_text="${before}";`);
    if (getdata[0]?.guildid) {
        const set = await sql(`update dictionary set after_text="${after}" where guildid="${interaction.guild.id}" and before_text="${before}";`);
        if (!set) return ({ embeds: [db_error], ephemeral: true });
    } else {
        const set = await sql(`INSERT INTO dictionary(guildid,before_text,after_text) VALUES ("${interaction.guild.id}","${before}","${after}");`);
        if (!set) return ({ embeds: [db_error], ephemeral: true });
    };
    const success = new EmbedBuilder()
        .setTitle(`✅完了`)
        .setDescription(`辞書を更新しました！\n単語:${before}\n読み:${after}`)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
        .setColor(Colors.Green);
    return ({ embeds: [success] });
};