const { Events } = require('discord.js');
const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const { Readable } = require('node:stream');
const {sql}= require("../../helpers/utils")
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (!message.guild?.members?.me?.voice?.channel?.id) return;
        if (!message.member?.voice?.channel?.id) return;
        if (message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) return;
        const getdata = await sql(`select * from user_speak where userid="${message.member.id}";`);
        const speaker = getdata[0]?.speakid || 3;
        const port = getdata[0]?.speakport || 50021;
        const audio_query_response = await fetch(
            `http://127.0.0.1:${port}/audio_query?text=${message.content}&speaker=${speaker}`,
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        const audio_query_json = await audio_query_response.json();
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
    }
}