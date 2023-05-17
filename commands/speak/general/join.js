const { joinVoiceChannel } = require("@discordjs/voice");
const { CustomEmbed } = require("../../../libs");

module.exports = {
    builder: (builder) => builder
        .setName("join")
        .setDescription("ボイスチャンネルに参加します。")
    ,
    execute(interaction) {
        const { guild } = interaction;
        const vcChannel = interaction.member.voice.channel;
        const embed = new CustomEmbed("speak")
        if (!vcChannel) {
            embed.typeError().setDescription("ボットを使用するにはボイスチャンネルに参加してください。");
        } else {
            joinVoiceChannel({
                channelId: vcChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfMute:true,
                selfDeaf:true,
            });
            if (!globalThis.voice_channel[guild.id]) delete globalThis.voice_channel[guild.id];
            globalThis.voice_channel[guild.id] = interaction.channel.id;
            embed.typeSuccess().setDescription("ボイスチャンネルに参加しました。");
        }
        interaction.reply({ embeds: [embed] });
    }
};