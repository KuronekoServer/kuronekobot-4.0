const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../libs/Utils");
const { escape } = require("mysql2")

const db_error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
const undefiend_error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("データが見つかりません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
const remove_success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`正常に削除されました。`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
module.exports = async (interaction) => {
    const getdata = await sql(`select * from server_speak where guildid=${escape(interaction.guild.id)};`);
        if (!getdata[0][0]?.guildid) return ({ embeds: [undefiend_error] });
        const set = await sql(`update server_speak set auto_text_channel=null,auto_voice_channel=null where guildid=${escape(interaction.guild.id)};`);
        if (!set) return ({ embeds: [db_error] });
        return ({ embeds: [remove_success] });
};