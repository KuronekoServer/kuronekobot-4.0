const { Events } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {
        const connection = getVoiceConnection(guild.id);
        if (globalThis.voice_channel[guild.id]) delete globalThis.voice_channel[guild.id];
        if (connection?.state?.status) connection.destroy();
    }
}