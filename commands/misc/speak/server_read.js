const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../libs/Utils");
const { escape } = require("mysql2")

const db_error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const boolean = interaction.options.getString("toggle");
    const ope = interaction.options.getString("操作");
    const getdata = await sql(`select * from server_speak where guildid=${escape(interaction.guild.id)};`);
    if (ope === "message") {
        if (boolean === "true") {
            if (getdata[0][0]?.guildid) {
                const set = await sql(`update server_speak set read_username=true where guildid=${escape(interaction.guild.id)};`);
                if (!set) return ({ embeds: [db_error] });
            } else {
                const set = await sql(`INSERT INTO server_speak(guildid,read_username) VALUES (${escape(interaction.guild.id)},true);`);
                if (!set) return ({ embeds: [db_error] });
            };
            const success = new EmbedBuilder()
                .setTitle(`✅完了`)
                .setDescription("ユーザー名を読み上げるようになりました！")
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
                .setColor(Colors.Green);
            return ({ embeds: [success] });
        };
        if (boolean === "false") {
            if (getdata[0][0]?.guildid) {
                const set = await sql(`update server_speak set read_username=null where guildid=${escape(interaction.guild.id)};`);
                if (!set) return ({ embeds: [db_error] });
            } else {
                const set = await sql(`INSERT INTO server_speak(guildid,read_username) VALUES (${escape(interaction.guild.id)},null);`);
                if (!set) return ({ embeds: [db_error] });
            };
            const success = new EmbedBuilder()
                .setTitle(`✅完了`)
                .setDescription("ユーザー名を読み上げないようになりました！")
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
                .setColor(Colors.Green);
            return ({ embeds: [success] });
        };
    };
    if (ope === "join") {
        if (boolean === "true") {
            const success = new EmbedBuilder()
                .setTitle(`✅完了`)
                .setDescription(`入退出時にユーザー名を読み上げるようにしました！`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
                .setColor(Colors.Green);
            if (getdata[0][0]?.guildid) {
                const set = await sql(`update server_speak set read_joinremove=true where guildid=${escape(interaction.guild.id)};`);
                if (!set) return ({ embeds: [db_error] });
            } else {
                const set = await sql(`INSERT INTO server_speak(guildid,read_joinremove) VALUES (${escape(interaction.guild.id)},true);`);
                if (!set) return ({ embeds: [db_error] });
            };
            return ({ embeds: [success] });
        };
        if (boolean === "false") {
            const success_delete = new EmbedBuilder()
                .setTitle(`✅完了`)
                .setDescription(`入退出時にユーザー名を読み上げないようにしました！`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
                .setColor(Colors.Green);
            if (getdata[0][0]?.guildid) {
                const set = await sql(`update server_speak set read_joinremove=null where guildid=${escape(interaction.guild.id)};`);
                if (!set) return ({ embeds: [db_error] });
            } else {
                const set = await sql(`INSERT INTO server_speak(guildid,read_joinremove) VALUES (${escape(interaction.guild.id)},null);`);
                if (!set) return ({ embeds: [db_error] });
            };
            return ({ embeds: [success_delete] });
        };
    };
};