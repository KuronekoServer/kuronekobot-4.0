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
const remove_success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`正常に削除されました。`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
module.exports = async (interaction) => {
    const text = interaction.options.getChannel("textchannel");
    const voice = interaction.options.getChannel("voicechannel");
    const remove = interaction.options.getString("toggle");
    const getdata = await sql(`select * from server_speak where guildid="${interaction.guild.id}";`);
    if (remove === "削除") {
        if (!getdata[0]?.guildid) return ({ embeds: [undefiend_error] });
        const set = await sql(`update server_speak set auto_text_channel=null,auto_voice_channel=null where guildid="${interaction.guild.id}";`);
        if (!set) return ({ embeds: [db_error], ephemeral: true });
        return ({ embeds: [remove_success] });
    };
    if (getdata[0]?.guildid) {
        const set = await sql(`update server_speak set auto_text_channel="${text.id}",auto_voice_channel="${voice.id}" where guildid="${interaction.guild.id}";`);
        if (!set) return ({ embeds: [db_error], ephemeral: true });
    } else {
        const set = await sql(`INSERT INTO server_speak(guildid,auto_text_channel,auto_voice_channel) VALUES ("${interaction.guild.id}","${text.id}","${voice.id}");`);
        if (!set) return ({ embeds: [db_error], ephemeral: true });
    };
    const success = new EmbedBuilder()
        .setTitle(`✅完了`)
        .setDescription(`autochannelを更新しました！\nテキストチャンネル:${text}\nボイスチャンネル:${voice}`)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
        .setColor(Colors.Green);
    return ({ embeds: [success] });
};