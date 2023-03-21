const { EmbedBuilder, Colors } = require("discord.js");
const { read } = require("../../../helpers/read");
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
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription(`スキップしました！`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | speak" })
    .setColor(Colors.Green);
module.exports = async (interaction) => {
    if (!interaction?.guild?.members?.me?.voice?.channel?.id) return ({ embeds: [nojoin_error] });
    if (!globalThis.voice_channel[interaction.guild.id]) return ({ embeds: [undefined_error] });
    if (interaction.member?.voice?.channel?.id !== interaction?.guild?.members?.me?.voice?.channel?.id) return ({ embeds: [error] });
    await read(interaction, "システム", "スキップしました", true);
    return ({embeds: [success]});
};