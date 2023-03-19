//可読性皆無本当に申し訳ないけど実装に苦労したから許して(⋈◍＞◡＜◍)。✧♡
const { Events } = require('discord.js');
const { createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const { Readable } = require('node:stream');
const { sql } = require("../../helpers/utils");
const fs = require("node:fs");
const axios = require("axios");
const { getJson } = require("../../helpers/HttpUtils");
const exvoice_list = {};
fs.readdirSync(`${process.env.exvoice}`).map(data => {
    exvoice_list[data] = fs.readdirSync(`${process.env.exvoice}/${data}`).map(name => name.replace(".wav", ""));
});
const max_message = 50;
const read = async message => {
    const get_server_data = await sql(`select * from server_speak where guildid="${message.guild.id}";`);
    const getdata = await sql(`select * from user_speak where userid="${message.member.id}";`);
    const dictionary = await sql(`select * from dictionary where guildid="${message.guild.id}";`);
    const speaker = (get_server_data[0]?.force_voice) ? get_server_data[0]?.speakid || getdata[0]?.speakid || 3 : getdata[0]?.speakid || get_server_data[0]?.speakid || 3;
    const port = (get_server_data[0]?.force_voice) ? get_server_data[0]?.speakport || getdata[0]?.speakport || process.env.voicevox : getdata[0]?.speakport || get_server_data[0]?.speakport || process.env.voicevox;
    const name = (get_server_data[0]?.force_voice) ? get_server_data[0]?.speakname || getdata[0]?.speakname || "ずんだもん" : getdata[0]?.speakname || get_server_data[0]?.speakname || "ずんだもん";
    const speed = (get_server_data[0]?.force_args) ? get_server_data[0]?.speed || getdata[0]?.speed || 1 : getdata[0]?.speed || get_server_data[0]?.speed || 1;
    const pitch = (get_server_data[0]?.force_args) ? get_server_data[0]?.pitch || getdata[0]?.pitch || 0 : getdata[0]?.pitch || get_server_data[0]?.pitch || 0;
    const intonation = (get_server_data[0]?.force_args) ? get_server_data[0]?.intonation || getdata[0]?.intonation || 1 : getdata[0]?.intonation || get_server_data[0]?.intonation || 1;
    const exvoice = exvoice_list[name];
    const before_msg = (get_server_data[0]?.read_username) ? `${message.author.username}さんのメッセージ　${message.content}` : message.content;
    const reg = before_msg.match(/((http|https):\/\/[^\s]+)/g);
    const romajimsg = before_msg.replace(new RegExp(reg, 'g'), "リンク省略");
    const format_msg = await axios.get(`https://eng-jpn-api.kuroneko6423.com/query?text=${romajimsg}`).catch((ex) => { });
    const msg = (format_msg.data) ? format_msg.data : romajimsg;
    const check = exvoice.find(str => msg.includes(str));
    if (exvoice && check && !get_server_data[0]?.exvoice) {
        const not_exvoice = (await sql(`select * from exvoiceword where guildid="${message.guild.id}" and speakname="${name}";`)).map(data => data.word);
        const matchStr = exvoice.find(str => msg.includes(str)); // 配列内に一致する要素を検索する
        const result = msg.substring(msg.indexOf(matchStr), msg.indexOf(matchStr) + matchStr.length);
        const array = msg.split(result)//result を基準に文字列を分割する
        const splitResult = (not_exvoice.includes(result)) ? ["", array.join(result)] : [array.shift(), array.join(result)];
        let newString = "";
        let string_array = [];
        await Promise.all(splitResult.map(async content => {
            if (JSON.parse(JSON.stringify(dictionary)).length !== 0) {
                const mapObj = {};
                await Promise.all(JSON.parse(JSON.stringify(dictionary)).map(({ before_text, after_text }) => mapObj[before_text] = after_text));
                for (let i = 0; i < content.length; i++) {
                    const char = content[i];
                    const mappedChar = mapObj[char];
                    newString += mappedChar ? mappedChar : char;//ハッシュ
                };
                string_array.push(newString.replace(string_array[0], ""));
            };
        }));
        const last_content = (string_array.length === 0) ?
            (splitResult.join("").length >= max_message) ? `${splitResult[1].slice(0, (40 - splitResult[0].length <= 0) ? 0 : 40 - splitResult[0].length)}以下省略` : splitResult[1] :
            (string_array.join("").length >= max_message) ? `${string_array[1].slice(0, (40 - string_array[0].length <= 0) ? 0 : 40 - string_array[0].length)}以下省略` : string_array[1];
        const audio_query_response_start = await fetch(
            `http://127.0.0.1:${port}/audio_query?text=${(string_array.length === 0) ? splitResult[0] : string_array[0]}&speaker=${speaker}`,
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        const audio_query_response_last = await fetch(
            `http://127.0.0.1:${port}/audio_query?text=${last_content}&speaker=${speaker}`,
            {
                method: 'post',
                headers: { 'Content-Type': 'application/json' }
            }
        );
        const buffer_array = [];
        await Promise.all([...Array(2)].map(async (_, index) => {
            const audio_query_json = (index === 0) ? await audio_query_response_start.json() : await audio_query_response_last.json();
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
            const synthesis_response_buf = await synthesis_response.arrayBuffer();
            buffer_array.push(Buffer.from(synthesis_response_buf, "base64").toString("base64"));
        }));

        if (!not_exvoice.includes(result)) {
            const exvoice_file = fs.readFileSync(`${process.env.exvoice}/${name}/${result}.wav`).toString("base64");
            buffer_array.splice(1, 0, exvoice_file);
        };
        const response = await axios.post(
            `http://127.0.0.1:${port}/connect_waves`,
            buffer_array,
            {
                headers: {
                    "accept": "audio/wav",
                    'Content-Type': 'application/json',
                },
                responseType: "arraybuffer",
            }
        );
        const bufferStream = new Readable();
        bufferStream.push(response.data);
        bufferStream.push(null);
        const voiceChannel = getVoiceConnection(message.guild.id);
        if (!voiceChannel) return;
        const resource = createAudioResource(bufferStream);
        const player = createAudioPlayer();
        player.play(resource);
        voiceChannel.subscribe(player);
    } else {
        let newString = "";
        if (JSON.parse(JSON.stringify(dictionary)).length !== 0) {
            const mapObj = {};
            await Promise.all(JSON.parse(JSON.stringify(dictionary)).map(({ before_text, after_text }) => mapObj[before_text] = after_text));
            for (let i = 0; i < msg.length; i++) {
                const char = msg[i];
                const mappedChar = mapObj[char];
                newString += mappedChar ? mappedChar : char;//ハッシュ
            };
        };
        const content = (newString === "") ?
            (msg.length >= max_message) ? `${msg.slice(0, max_message)}以下省略` : msg :
            (newString.length >= max_message) ? `${newString.slice(0, max_message)}以下省略` : newString;

        const audio_query_response = await fetch(
            `http://127.0.0.1:${port}/audio_query?text=${content}&speaker=${speaker}`,
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
};
module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.username.startsWith(";")) return;
        if (message.content.startsWith(";")) return;
        const user_read = await sql(`select * from read_user where guildid="${message.guild.id}" and userid="${message.author.id}";`);
        if (!message?.guild?.members?.me?.voice?.channel?.id) return;
        if (!globalThis.voice_channel[message.guild.id]) return;
        if (globalThis.voice_channel[message.guild.id] !== message.channel.id) return;
        if (message.member?.voice?.channel?.id !== message?.guild?.members?.me?.voice?.channel?.id) return;
        if (user_read[0]?.readmsg) return read(message);
        if (user_read[0]?.readmsg === 0) return;
        const get_server_data = await sql(`select * from server_speak where guildid="${message.guild.id}";`);
        if (!get_server_data[0]?.bot_read) {
            if (message.author.bot) return;
        };
        read(message);
    }
}