const { Events } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel } = require('@discordjs/voice');
const { sql } = require("../../libs/Utils");
const { escape } = require("mysql2")

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        if (!oldState.channel && !newState.channel) return;
        const connection = getVoiceConnection(oldState.guild.id);
        //autojoin
        if (!oldState.channel?.id) {
            const getdata = await sql(`select * from server_speak where guildid=${escape(newState?.guild?.id)};`);
            if (getdata[0][0]?.auto_voice_channel === newState.channel?.id) {
                if (!connection?.state?.status) {
                    joinVoiceChannel({
                        channelId: newState.channel?.id,
                        guildId: newState.guild.id,
                        adapterCreator: newState.channel.guild.voiceAdapterCreator,
                        selfMute:true,
                        selfDeaf:true,
                    });
                    if (!globalThis.voice_channel[newState.guild.id]) delete globalThis.voice_channel[newState.guild.id];
                    globalThis.voice_channel[newState.guild.id] = getdata[0][0]?.auto_text_channel;
                };
            };
        };
    }
}