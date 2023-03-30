const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const { escape } = require("mysql2")

const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`ユーザー名に辞書を適応します！`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const success_delete = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`ユーザー名に辞書を適応しないようにしました！`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
module.exports = async (interaction) => {
    const boolean = interaction.options.getString("toggle");
    const getdata = await sql(`select * from server_speak where guildid=${escape(interaction.guild.id)};`);
    if (boolean === "true") {
        if (getdata[0][0]?.guildid) {
            const set = await sql(`update server_speak set dictionary_username=true where guildid=${escape(interaction.guild.id)};`);
            if (!set) return ({ embeds: [db_error] });
        } else {
            const set = await sql(`INSERT INTO server_speak(guildid,dictionary_username) VALUES (${escape(interaction.guild.id)},true);`);
            if (!set) return ({ embeds: [db_error] });
        };
        return ({ embeds: [success] });
    };
    if (boolean === "false") {
        if (getdata[0][0]?.guildid) {
            const set = await sql(`update server_speak set dictionary_username=null where guildid=${escape(interaction.guild.id)};`);
            if (!set) return ({ embeds: [db_error] });
        } else {
            const set = await sql(`INSERT INTO server_speak(guildid,dictionary_username) VALUES (${escape(interaction.guild.id)},null);`);
            if (!set) return ({ embeds: [db_error] });
        };
        return ({ embeds: [success_delete] });
    };
};