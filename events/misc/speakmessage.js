const { Events, ChannelType } = require('discord.js');
const { sql } = require("../../libs/Utils");
const { escape } = require("mysql2")

const { read } = require("../../helpers/read");
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.channel.type === ChannelType.DM) return;
        if (message.author.username.startsWith(";")) return;
        if (message.content.startsWith(";")) return;
        const user_read = await sql(`select * from read_user where guildid=${escape(message.guild.id)} and userid=${escape(message.author.id)};`);
        if (!message?.guild?.members?.me?.voice?.channel?.id) return;
        if (!globalThis.voice_channel[message.guild.id]) return;
        if (globalThis.voice_channel[message.guild.id] !== message.channel.id) return;
        const get_server_data = await sql(`select * from server_speak where guildid=${escape(message.guild.id)};`);
        if (get_server_data[0][0]?.read_through) return;
        if (message.member?.voice?.channel?.id !== message?.guild?.members?.me?.voice?.channel?.id && get_server_data[0][0]?.only_tts !== 1) return;
        const tmp = message?.attachments?.size > 0;
        if (user_read[0][0]?.readmsg) return await read(message, message.author.username, message.content, false, tmp);
        if (user_read[0][0]?.readmsg === 0) return;
        if (!get_server_data[0][0]?.bot_read) {
            if (message.author.bot) return;
        };
        await read(message, message.author.username, message.content, false, tmp);
    }
}