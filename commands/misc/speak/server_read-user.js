const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("ユーザーを読み上げ対象に入れました！")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const remove_success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("ユーザーを読み上げ対象から外しました！")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
module.exports = async (interaction) => {
    const getdata = await sql(`select * from read_user where guildid="${interaction.guild.id}";`);
    const boolean = interaction.options.getString("toggle");
    const user = interaction.options.getUser("user");
    if (boolean === "true") {
        if (getdata[0]?.userid === user.id) {
            const set = await sql(`update read_user set readmsg=true where guildid="${interaction.guild.id}" and userid="${user.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO read_user(guildid,userid,readmsg) VALUES ("${interaction.guild.id}","${user.id}",true);`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
        return ({ embeds: [success] });
    };
    if (boolean === "false") {
        if (getdata[0]?.userid === user.id) {
            const set = await sql(`update read_user set readmsg=false where guildid="${interaction.guild.id}" and userid="${user.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO read_user(guildid,userid,readmsg) VALUES ("${interaction.guild.id}","${user.id}",false);`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
        return ({ embeds: [remove_success] });
    };
};