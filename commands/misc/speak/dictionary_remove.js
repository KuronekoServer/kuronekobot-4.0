const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const { escape } = require("mysql2")

const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("対象の単語が登録されていません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const delete_text = interaction.options.getString("delete");
    const getdata = await sql(`select * from dictionary where guildid=${escape(interaction.guild.id)} and before_text=${escape(delete_text)};`);
    if (getdata[0][0]?.guildid) {
        const set = await sql(`DELETE FROM dictionary WHERE guildid=${escape(interaction.guild.id)} and before_text=${escape(delete_text)};`);
        if (!set) return ({ embeds: [db_error] });
    } else return ({ embeds: [error] });
    const success = new EmbedBuilder()
        .setTitle(`✅完了`)
        .setDescription(`辞書を削除しました！\n単語:${delete_text}`)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
        .setColor(Colors.Green);
    return ({ embeds: [success] });
};