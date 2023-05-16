const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../libs/Utils");
const { escape } = require("mysql2")

const db_error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const getdata = await sql(`select * from server_speak where guildid="${interaction.guild.id}";`);
    const boolean = interaction.options.getString("toggle");
    if (boolean === "true") {
        if (getdata[0][0]?.guildid) {
            const set = await sql(`update server_speak set exvoice=null where guildid=${escape(interaction.guild.id)};`);
            if (!set) return ({ embeds: [db_error] });
        } else {
            const set = await sql(`INSERT INTO server_speak(guildid,exvoice) VALUES (${escape(interaction.guild.id)},null);`);
            if (!set) return ({ embeds: [db_error] });
        };
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription("exvoiceを有効にしました！")
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        return ({ embeds: [success] });
    };
    if (boolean === "false") {
        if (getdata[0][0]?.guildid) {
            const set = await sql(`update server_speak set exvoice=true where guildid=${escape(interaction.guild.id)};`);
            if (!set) return ({ embeds: [db_error] });
        } else {
            const set = await sql(`INSERT INTO server_speak(guildid,exvoice) VALUES (${escape(interaction.guild.id)},true);`);
            if (!set) return ({ embeds: [db_error] });
        };
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription("exvoiceを無効にしました！")
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        return ({ embeds: [success] });
    };
};