const { Events } = require('discord.js');
const { sql } = require("../../helpers/utils");
const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const { Readable } = require('node:stream');
//読み上げ
const read = async (message, content) => {
    if (!message?.guild?.members?.me?.voice?.channel?.id) return;
    if (!globalThis.voice_channel[message.guild.id]) return;
    const getdata = await sql(`select * from user_speak where userid="${message.member.id}";`);
    const dictionary = await sql(`select * from dictionary where guildid="${message.guild.id}";`);
    const get_server_data = await sql(`select * from server_speak where guildid="${message.guild.id}";`);
    const speaker = (get_server_data[0]?.force_voice) ? get_server_data[0]?.speakid || getdata[0]?.speakid || 3 : getdata[0]?.speakid || get_server_data[0]?.speakid || 3;
    const port = (get_server_data[0]?.force_voice) ? get_server_data[0]?.speakport || getdata[0]?.speakport || process.env.voicevox : getdata[0]?.speakport || get_server_data[0]?.speakport || process.env.voicevox;
    const speed = (get_server_data[0]?.force_args) ? get_server_data[0]?.speed || getdata[0]?.speed || 1 : getdata[0]?.speed || get_server_data[0]?.speed || 1;
    const pitch = (get_server_data[0]?.force_args) ? get_server_data[0]?.pitch || getdata[0]?.pitch || 0 : getdata[0]?.pitch || get_server_data[0]?.pitch || 0;
    const intonation = (get_server_data[0]?.force_args) ? get_server_data[0]?.intonation || getdata[0]?.intonation || 1 : getdata[0]?.intonation || get_server_data[0]?.intonation || 1;
    let newString = "";
    if (JSON.parse(JSON.stringify(dictionary)).length !== 0) {
        const mapObj = {};
        await Promise.all(JSON.parse(JSON.stringify(dictionary)).map(({ before_text, after_text }) => mapObj[before_text] = after_text));
        for (let i = 0; i < message.member.user.username.length; i++) {
            const char = message.member.user.username[i];
            const mappedChar = mapObj[char];
            newString += mappedChar ? mappedChar : char;//ハッシュ
        };
    }
    const audio_query_response = await fetch(
        `http://127.0.0.1:${port}/audio_query?text=${(newString === "") ? message.member.user.username + content : newString + content}&speaker=${speaker}`,
        {
            method: 'post',
            headers: { 'Content-Type': 'application/json' }
        }
    );
    const audio_query_json = await audio_query_response.json();
    audio_query_json["speedScale"] = speed;
    audio_query_json["pitchScale"] = pitch;
    audio_query_json["intonationScale"] = intonation;
    const synthesis_response = await fetch(
        `http://127.0.0.1:${port}/synthesis?speaker=${speaker}`,
        {
            method: 'post',
            body: JSON.stringify(audio_query_json),
            responseType: "arrayBuffer",
            headers: { "accept": "audio/wav", 'Content-Type': 'application/json' },
        }
    );
    const synthesis_response_buf = Buffer.from(await synthesis_response.arrayBuffer(), "base64");
    const bufferStream = new Readable();
    bufferStream.push(synthesis_response_buf);
    bufferStream.push(null);
    const voiceChannel = getVoiceConnection(message.guild.id);
    if (!voiceChannel) return;
    const resource = createAudioResource(bufferStream);
    const player = createAudioPlayer();
    player.play(resource);
    voiceChannel.subscribe(player);
};

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const getdata = await sql(`select * from server_speak where guildid="${newState?.guild?.id}";`);
        if (!getdata[0]?.read_joinremove) return;
        //退出時
        if (oldState.channel && !newState.channel) {
            if (oldState.member.user.username.startsWith(";")) return;
            const user_read = await sql(`select * from read_user where guildid="${oldState.guild.id}" and userid="${oldState.member.user.id}";`);
            if (user_read[0]?.readmsg) return read(newState, "さんが退出しました");
            if (user_read[0]?.readmsg === 0) return;
            if (oldState.member.user.bot) return;
            read(oldState, "さんが退出しました");
        };
        //入室時
        if (!oldState.channel && newState.channel) {
            if (newState.member.user.username.startsWith(";")) return;
            const user_read = await sql(`select * from read_user where guildid="${newState.guild.id}" and userid="${newState.member.user.id}";`);
            if (user_read[0]?.readmsg) return read(newState, "さんが入室しました");
            if (user_read[0]?.readmsg === 0) return;
            if (newState.member.user.bot) return;
            read(newState, "さんが入室しました");
        };
    }
}