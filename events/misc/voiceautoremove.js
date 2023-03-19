const { Events } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        if (!oldState.channel && !newState.channel) return;
        const connection = getVoiceConnection(oldState.guild.id);
        //KICKされた場合
        if (oldState.member.user.id === process.env.clientId && oldState.channelId && !newState.channelId) {
            if (connection?.state?.status) connection.destroy();
            if (globalThis.voice_channel[oldState.guild.id]) delete globalThis.voice_channel[oldState.guild.id];
        };
        //メンバーがいなくなった場合
        if (!oldState?.channel?.id) return;
        if (!globalThis.voice_channel[oldState?.guild?.id]) return;
        if (oldState?.guild?.members?.me?.voice?.channel?.id !== oldState.channel?.id) return;
        const listeners = oldState?.channel?.members?.size;
        if (!listeners) return;
        if (listeners > 1) return;
        connection.destroy();
        delete globalThis.voice_channel[oldState.guild.id];
    }
}