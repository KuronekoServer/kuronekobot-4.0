const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("イントネーションを変更しました！")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const sizemax_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("最高は2.0までです。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const sizemin_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("最低は0.0までです。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const getdata = await sql(`select * from server_speak where guildid="${interaction.guild.id}";`);
    const intonation = interaction.options.getNumber("intonation");
    if (intonation) {
        if (intonation > 2) return({ embeds: [sizemax_error] });
        if (intonation < 0) return({ embeds: [sizemin_error] });
        if (getdata[0]?.guildid) {
            const set = await sql(`update server_speak set intonation=${intonation} where guildid="${interaction.guild.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO server_speak(guildid,intonation) VALUES ("${interaction.guild.id}",${intonation});`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
    } else {
        if (getdata[0]?.guildid) {
            const set = await sql(`update server_speak set intonation=null where guildid="${interaction.guild.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO server_speak(guildid,intonation) VALUES ("${interaction.guild.id}",null);`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
    };
    return ({ embeds: [success] });
};