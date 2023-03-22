const { EmbedBuilder, Colors } = require("discord.js");
const nojoin_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("BOTがボイスチャンネルに参加していません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const undefined_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("ボイスチャンネルのデータが取得できません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("貴方と参加しているボイスチャンネルが違います。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const noalready_error = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("何も再生していません。")
    .setColor(Colors.Red)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" });
const stop_success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`切断されました。`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
module.exports = async (interaction) => {
    if (!interaction?.guild?.members?.me?.voice?.channel?.id) return ({ embeds: [nojoin_error] });
    if (!globalThis.voice_channel[interaction.guild.id]) return ({ embeds: [undefined_error] });
    if (interaction.member?.voice?.channel?.id !== interaction?.guild?.members?.me?.voice?.channel?.id) return ({ embeds: [error] });
    const select = interaction.options.getString("select");
    if (select === "youtube") {
        if (!globalThis.ylivechat[interaction.guild.id]) return ({ embeds: [noalready_error] });
        await globalThis.ylivechat[interaction.guild.id]?.stop().catch(() => { });
        delete globalThis.ylivechat[interaction.guild.id];
        return ({ embeds: [stop_success] });
    };
    if (select === "twitch") {
        if (!globalThis.tlivechat[interaction.guild.id]) return ({ embeds: [noalready_error] });
        await globalThis.tlivechat[interaction.guild.id]?.disconnect().catch(() => { });
        delete globalThis.tlivechat[interaction.guild.id];
        return ({ embeds: [stop_success] });
    };
};