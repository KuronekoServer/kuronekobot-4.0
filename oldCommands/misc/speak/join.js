const { EmbedBuilder, Colors } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice');

const success = new EmbedBuilder()
    .setTitle(`✅完了`)
    .setDescription("ボイスチャンネルに参加しました！")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | jobpanel" })
    .setColor(Colors.Green);
const undefined_channel = new EmbedBuilder()
    .setTitle(`⚠エラー`)
    .setDescription("貴方が参加しているボイスチャンネルを見つけることができませんでした。")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | jobpanel" })
    .setColor(Colors.Red);

module.exports = async (interaction) => {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return ({ embeds: [undefined_channel] });
     joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        selfMute:true,
        selfDeaf:true,
    });
    if (!globalThis.voice_channel[interaction.guild.id]) delete globalThis.voice_channel[interaction.guild.id];
    globalThis.voice_channel[interaction.guild.id] = interaction.channel.id;
    return ({ embeds: [success] });
};