//voicevox:http://127.0.0.1:50021/docs#/
//COEIROINK:http://127.0.0.1:50031/docs#/
//SHAREVOX:http://127.0.0.1:50025/docs#/
const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../helpers/utils");
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("ボイスチャンネルに参加しました！")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("パネルの選択更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const undefined_choice = new EmbedBuilder()
    .setTitle(`⚠️エラー`)
    .setDescription("何も選択されていません。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Red);
module.exports = async (interaction) => {
    const getdata = await sql(`select * from user_speak where userid="${interaction.user.id}";`);
    if (interaction.options.getString("voicevox話者名")) {
        if (getdata[0]?.userid) {
            const set = await sql(`update user_speak set speakid=${interaction.options.getString("voicevox話者名")},speakport=50021 where userid="${interaction.user.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO user_speak(userid,speakid,speakport) VALUES ("${interaction.user.id}",${interaction.options.getString("voicevox話者名")},50021);`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
    } else if (interaction.options.getString("coeiroink話者名")) {
        if (getdata[0]?.userid) {
            const set = await sql(`update user_speak set speakid=${interaction.options.getString("coeiroink話者名")},speakport=50031 where userid="${interaction.user.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO user_speak(userid,speakid,speakport) VALUES ("${interaction.user.id}",${interaction.options.getString("coeiroink話者名")},50031);`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
    } else if (interaction.options.getString("sharevox話者名")) {
        if (getdata[0]?.userid) {
            const set = await sql(`update user_speak set speakid=${interaction.options.getString("sharevox話者名")},speakport=50025 where userid="${interaction.user.id}";`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO user_speak(userid,speakid,speakport) VALUES ("${interaction.user.id}",${interaction.options.getString("sharevox話者名")},50025);`);
            if (!set) return ({ embeds: [db_error], ephemeral: true });
        };
    } else {
        return ({ embeds: [undefined_choice] });
    };
    return ({ embeds: [success] });
};