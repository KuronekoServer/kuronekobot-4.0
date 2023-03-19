const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const getdata = await sql(`select * from server_speak where guildid="${interaction.guild.id}";`);
    const boolean = interaction.options.getString("toggle");
    if (boolean === "true") {
        if (getdata[0]?.guildid) {
            const set = await sql(`update server_speak set force_voice=true where guildid="${interaction.guild.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO server_speak(guildid,force_voice) VALUES ("${interaction.guild.id}",true);`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription("サーバー話者を強制しました！")
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        return ({ embeds: [success] });
    };
    if (boolean === "false") {
        if (getdata[0]?.guildid) {
            const set = await sql(`update server_speak set force_voice=null where guildid="${interaction.guild.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO server_speak(guildid,force_voice) VALUES ("${interaction.guild.id}",null);`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
        const success = new EmbedBuilder()
            .setTitle(`✅完了`)
            .setDescription("サーバー話者の強制を解除しました！")
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
            .setColor(Colors.Green);
        return ({ embeds: [success] });
    };
};