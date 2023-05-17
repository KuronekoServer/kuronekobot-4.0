const { EmbedBuilder, Colors } = require("discord.js");
const { sql } = require("../../../libs/Utils");
const { escape } = require("mysql2")

const db_error = new EmbedBuilder()
    .setTitle("⚠エラー")
    .setDescription("データ更新に失敗しました。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" });
module.exports = async (interaction) => {
    const text = interaction.options.getChannel("textchannel");
    const voice = interaction.options.getChannel("voicechannel");
    const getdata = await sql(`select * from server_speak where guildid=${escape(interaction.guild.id)};`);
    if (getdata[0][0]?.guildid) {
        const set = await sql(`update server_speak set auto_text_channel=${escape(text.id)},auto_voice_channel=${escape(voice.id)} where guildid=${escape(interaction.guild.id)};`);
        if (!set) return ({ embeds: [db_error] });
    } else {
        const set = await sql(`INSERT INTO server_speak(guildid,auto_text_channel,auto_voice_channel) VALUES (${escape(interaction.guild.id)},${escape(text.id)},${escape(voice.id)});`);
        if (!set) return ({ embeds: [db_error] });
    };
    const success = new EmbedBuilder()
        .setTitle(`✅完了`)
        .setDescription(`autochannelを更新しました！\nテキストチャンネル:${text}\nボイスチャンネル:${voice}`)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | speak" })
        .setColor(Colors.Green);
    return ({ embeds: [success] });
};