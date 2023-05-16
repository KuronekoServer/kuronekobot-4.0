const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../libs/Utils");
const { escape } = require("mysql2")
const { PagesManager } = require('discord.js-pages');
const pagesManager = new PagesManager();
const db_error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
const url = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`https://kuroneko6423.com/exvoice`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const undefined_error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("データが見つかりません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const name = interaction.options.getString("話者");
    const select = interaction.options.getString("select");
    if (select === "add") {
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription(`${name.split(",").join("(")})を追加しました！`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        const getdata = await sql(`select * from exvoiceword where guildid=${escape(interaction.guild.id)} and speakname=${escape(name.split(",")[1])} and word=${escape(name.split(",")[0])};`);
        if (!getdata[0][0]?.word) {
            const set = await sql(`INSERT INTO exvoiceword(guildid,word,speakname) VALUES (${escape(interaction.guild.id)},${escape(name.split(",")[0])},${escape(name.split(",")[1])});`);
            if (!set) return ({ embeds: [db_error] });
        };
        return ({ embeds: [success] });
    };
    if (select === "remove") {
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription(`${name.split(",").join("(")})を削除しました！`)
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        const getdata = await sql(`select * from exvoiceword where guildid=${escape(interaction.guild.id)} and speakname=${escape(name.split(",")[1])} and word=${escape(name.split(",")[0])};`);
        if (getdata[0][0]?.word) {
            const set = await sql(`DELETE FROM exvoiceword where guildid=${escape(interaction.guild.id)} and speakname=${escape(name.split(",")[1])} and word=${escape(name.split(",")[0])};`);
            if (!set) return ({ embeds: [db_error] });
        }
        return ({ embeds: [success] });
    };
};