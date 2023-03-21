const { EmbedBuilder, Colors } = require("discord.js");
const { getVoiceConnection } = require('@discordjs/voice');
const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("ボイスチャンネルにから退出しました！")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
    .setColor(Colors.Green);
const undefined_channel = new EmbedBuilder()
    .setTitle(`⚠️エラー`)
    .setDescription("ボイスチャンネルに参加していません。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | jobpanel" })
    .setColor(Colors.Red);

module.exports = async (interaction) => {
    const voiceChannel = getVoiceConnection(interaction.guildId);
    if (!voiceChannel) return ({ embeds: [undefined_channel] });
    voiceChannel.destroy();
    delete globalThis.voice_channel[interaction.guild.id];
    if (globalThis.ylivechat[interaction.guild.id]) delete globalThis.ylivechat[interaction.guild.id];
    if (globalThis.tlivechat[interaction.guild.id]) delete globalThis.tlivechat[interaction.guild.id];
    return ({ embeds: [success] });
};
