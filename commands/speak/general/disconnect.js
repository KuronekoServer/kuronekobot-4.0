const { CustomEmbed } = require("../../../libs");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
    builder: (builder) => builder
        .setName("disconnect")
        .setDescription("ボイスチャンネルから退出します。")
    ,
    execute: async (interaction) => {
        const { guild } = interaction;
        const vcChannel = getVoiceConnection(guild.id);
        const embed = new CustomEmbed("speak");
        if (!vcChannel) {
            embed.typeError().setDescription("botがボイスチャンネルに参加していません。");
        } else {
            vcChannel.destroy();
            delete globalThis.voice_channel[guild.id];
            if (globalThis.ylivechat[guild.id]) {
                try {
                    await globalThis.ylivechat[guild.id]?.stop();
                } catch (error) { } finally {
                    delete globalThis.ylivechat[guild.id];
                };
            };
            if (globalThis.tlivechat[guild.id]) {
                try {
                    await globalThis.tlivechat[guild.id]?.disconnect();
                } catch (error) { } finally {
                    delete globalThis.tlivechat[guild.id];
                };
            };
            embed.typeSuccess().setDescription("ボイスチャンネルから退出しました。");
        }
        interaction.reply({ embeds: [embed] });
    }
};