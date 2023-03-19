const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const undefiend_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データが見つかりません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`入退出時にユーザー名を読み上げるようにしました！`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const success_delete = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`入退出時にユーザー名を読み上げないようにしました！`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
module.exports = async (interaction) => {
    const boolean = interaction.options.getString("toggle");
    const ope = interaction.options.getString("操作");
    const getdata = await sql(`select * from server_speak where guildid="${interaction.guild.id}";`);
    if (ope === "message") {
        if (boolean === "true") {
            if (getdata[0]?.guildid) {
                const set = await sql(`update server_speak set read_username=true where guildid="${interaction.guild.id}";`);
                if (!set) return ({ embeds: [db_error], ephemeral: true });
            } else {
                const set = await sql(`INSERT INTO server_speak(guildid,read_username) VALUES ("${interaction.guild.id}",true);`);
                if (!set) return ({ embeds: [db_error], ephemeral: true });
            };
            const success = new EmbedBuilder()
                .setTitle(`✅完了`)
                .setDescription("ユーザー名を読み上げるようになりました！")
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
                .setColor(Colors.Green);
            return ({ embeds: [success] });
        };
        if (boolean === "false") {
            if (getdata[0]?.guildid) {
                const set = await sql(`update server_speak set read_username=null where guildid="${interaction.guild.id}";`);
                if (!set) return ({ embeds: [db_error], ephemeral: true });
            } else {
                const set = await sql(`INSERT INTO server_speak(guildid,read_username) VALUES ("${interaction.guild.id}",null);`);
                if (!set) return ({ embeds: [db_error], ephemeral: true });
            };
            const success = new EmbedBuilder()
                .setTitle(`✅完了`)
                .setDescription("ユーザー名を読み上げないようになりました！")
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
                .setColor(Colors.Green);
            return ({ embeds: [success] });
        };
    };
    if (ope === "join") {
        if (boolean === "true") {
            if (getdata[0]?.guildid) {
                const set = await sql(`update server_speak set read_joinremove=true where guildid="${interaction.guild.id}";`);
                if (!set) return ({ embeds: [db_error], ephemeral: true });
            } else {
                const set = await sql(`INSERT INTO server_speak(guildid,read_joinremove) VALUES ("${interaction.guild.id}",true);`);
                if (!set) return ({ embeds: [db_error], ephemeral: true });
            };
            return ({ embeds: [success] });
        };
        if (boolean === "false") {
            if (!getdata[0]?.guildid) return ({ embeds: [undefiend_error] });
            const set = await sql(`update server_speak set read_joinremove=null where guildid="${interaction.guild.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
            return ({ embeds: [success_delete] });
        };
    };
};