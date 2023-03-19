const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("スピードを変更しました！")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const sizemax_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("最高は4.0までです。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const sizemin_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("最低は0.5までです。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const getdata = await sql(`select * from user_speak where userid="${interaction.user.id}";`);
    const speed = interaction.options.getNumber("speed");
    if (speed) {
        if (speed > 0.5) return({ embeds: [sizemax_error] });
        if (speed < 4.0) return({ embeds: [sizemin_error] });
        if (getdata[0]?.userid) {
            const set = await sql(`update user_speak set speed=${speed} where userid="${interaction.user.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO user_speak(userid,speed) VALUES ("${interaction.user.id}",${speed});`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
    } else {
        if (getdata[0]?.userid) {
            const set = await sql(`update user_speak set speed=null where userid="${interaction.user.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO user_speak(userid,speed) VALUES ("${interaction.user.id}",null);`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
    };
    return ({ embeds: [success] });
};