const { Events } = require('discord.js');
const { sql } = require("../../helpers/utils");
//読み上げ
const { read } = require("../../helpers/read");

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const getdata = await sql(`select * from server_speak where guildid="${newState?.guild?.id}";`);
        if (!getdata[0]?.read_joinremove) return;
        //退出時
        if (oldState.channel && !newState.channel) {
            if (oldState.member.user.username.startsWith(";")) return;
            const user_read = await sql(`select * from read_user where guildid="${oldState.guild.id}" and userid="${oldState.member.user.id}";`);
            if (user_read[0]?.readmsg) return await read(newState, "システム",`${oldState.member.user.username}さんが退出しました`);
            if (user_read[0]?.readmsg === 0) return;
            if (oldState.member.user.bot) return;
            await read(oldState, "システム",`${oldState.member.user.username}さんが退出しました`);
        };
        //入室時
        if (!oldState.channel && newState.channel) {
            if (newState.member.user.username.startsWith(";")) return;
            const user_read = await sql(`select * from read_user where guildid="${newState.guild.id}" and userid="${newState.member.user.id}";`);
            if (user_read[0]?.readmsg) return await read(newState, "システム", `${newState.member.user.username}さんが入室しました`);
            if (user_read[0]?.readmsg === 0) return;
            if (newState.member.user.bot) return;
            await read(newState, "システム", `${newState.member.user.username}さんが入室しました`);
        };
    }
}