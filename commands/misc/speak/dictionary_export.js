const { EmbedBuilder, Colors, AttachmentBuilder } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("対象の単語が登録されていません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const getdata = await sql(`select * from dictionary where guildid="${interaction.guild.id}"`);
    if (!getdata[0]?.guildid) return ({ embeds: [error], ephemeral: true });
    const format = interaction.options.getString("format") || "csv";
    const text = (format === "json") ? JSON.stringify(getdata) : getdata.map(data => `${data.before_text}${(format === "csv") ? "," : ":"}${data.after_text}`).join("\n")
    const success = new EmbedBuilder()
        .setTitle(`✅完了`)
        .setDescription(`添付ファイルをご確認ください。`)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
        .setColor(Colors.Green);
    return ({ embeds: [success], files: [new AttachmentBuilder().setFile(Buffer.from(text)).setName(`export.${format}`)] });
};