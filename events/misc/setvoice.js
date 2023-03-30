const { Events, Colors, EmbedBuilder } = require('discord.js');
const { sql } = require("../../helpers/utils");
const { escape } = require("mysql2")

const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("ボイスがセットされました！")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
const db_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const db_set = async (data, interaction) => {
    //サーバー設定か(配列の3番目に値がある場合はサーバー設定[IDが格納])
    if (data[3]) {
        const getdata = await sql(`select * from server_speak where guildid="${interaction?.guild?.id}";`);
        if (getdata[0][0]?.guildid) {
            const set = await sql(`update server_speak set speakid=${escape(data[1])},speakhost=${escape(data[0])},speakname=${escape(data[2])} where guildid=${escape(interaction.guild.id)};`);
            if (!set) return interaction.reply({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO server_speak(guildid,speakid,speakhost,speakname) VALUES (${escape(interaction.user.id)},${escape(data[1])},${escape(data[0])},${escape(data[2])});`);
            if (!set) return await interaction.reply({ embeds: [db_error], ephemeral: true });
        };
    } else {
        const getdata = await sql(`select * from user_speak where userid=${escape(interaction.user.id)};`);
        if (getdata[0][0]?.userid) {
            const set = await sql(`update user_speak set speakid=${escape(data[1])},speakhost=${escape(data[0])},speakname=${escape(data[2])} where userid=${escape(interaction.user.id)};`);
            if (!set) return interaction.reply({ embeds: [db_error], ephemeral: true });
        } else {
            const set = await sql(`INSERT INTO user_speak(userid,speakid,speakhost,speakname) VALUES (${escape(interaction.user.id)},${escape(data[1])},${escape(data[0])},${escape(data[2])});`);
            if (!set) return await interaction.reply({ embeds: [db_error], ephemeral: true });
        };
    };
    await interaction.reply({ embeds: [success], ephemeral: true });
}
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.customId === "voicevox") {
            const data = interaction.values[0].split(",");
            return db_set(data, interaction);
        };
        if (interaction.customId === "coeiroink") {
            const data = interaction.values[0].split(",");
            return db_set(data, interaction);
        };
        if (interaction.customId === "sharevox") {
            const data = interaction.values[0].split(",");
            return db_set(data, interaction);
        };
    }
};