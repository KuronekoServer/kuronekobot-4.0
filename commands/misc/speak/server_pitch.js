const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("ピッチを変更しました！")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const sizemax_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("最高は0.15までです。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const sizemin_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("最低は-0.15までです。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const getdata = await sql(`select * from server_speak where guildid="${interaction.guild.id}";`);
    const pitch = interaction.options.getNumber("pitch");
    if (pitch) {
        if (pitch > 0.15) return({ embeds: [sizemax_error] });
        if (pitch < -0.15) return({ embeds: [sizemin_error] });
        if (getdata[0]?.guildid) {
            const set = await sql(`update server_speak set pitch=${pitch} where guildid="${interaction.guild.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO server_speak(guildid,pitch) VALUES ("${interaction.guild.id}",${pitch});`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
    } else {
        if (getdata[0]?.guildid) {
            const set = await sql(`update server_speak set pitch=null where guildid="${interaction.guild.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO server_speak(guildid,pitch) VALUES ("${interaction.guild.id}",null);`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
    };
    return ({ embeds: [success] });
};