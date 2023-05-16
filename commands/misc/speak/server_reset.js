const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../libs/Utils");
const { escape } = require("mysql2")

const db_error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`削除しました！`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
module.exports = async (interaction) => {
    const dictionary_getdata = await sql(`select * from dictionary where guildid=${escape(interaction.guild.id)};`);
    if (dictionary_getdata[0][0]?.guildid) {
        const set = await sql(`DELETE FROM dictionary WHERE guildid=${escape(interaction.guild.id)};`);
        if (!set) return ({ embeds: [db_error] });
    };

    const server_speak_getdata = await sql(`select * from server_speak where guildid=${escape(interaction.guild.id)};`);
    if (server_speak_getdata[0][0]?.guildid) {
        const set = await sql(`DELETE FROM server_speak WHERE guildid=${escape(interaction.guild.id)};`);
        if (!set) return ({ embeds: [db_error] });
    };

    const read_user_getdata = await sql(`select * from read_user where guildid=${escape(interaction.guild.id)};`);
    if (read_user_getdata[0][0]?.guildid) {
        const set = await sql(`DELETE FROM read_user WHERE guildid=${escape(interaction.guild.id)};`);
        if (!set) return ({ embeds: [db_error] });
    };

    const exvoice = await sql(`select * from exvoiceword where guildid=${escape(interaction.guild.id)};`);
    if (exvoice[0][0]?.guildid) {
        const set = await sql(`DELETE FROM exvoiceword WHERE guildid=${escape(interaction.guild.id)};`);
        if (!set) return ({ embeds: [db_error] });
    };
    return ({ embeds: [success] });
};