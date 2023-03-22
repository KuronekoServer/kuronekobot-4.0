const http = require('http');
const https = require('https');
const { sql } = require("./utils");
const { createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const { Readable } = require('node:stream');
const fs = require("node:fs");
const axios = require("axios");
const exvoice_list = {};
const timeout = process.env.timeout
fs.readdirSync(`${process.env.exvoice}`).map(data => {
    exvoice_list[data] = fs.readdirSync(`${process.env.exvoice}/${data}`).map(name => name.replace(".wav", ""));
});
const max_message = process.env.max_message;

module.exports = {
    async read(message, user, live_content, skip, tmp) {
        const get_server_data = await sql(`select * from server_speak where guildid="${message.guild.id}";`);
        const getdata = await sql(`select * from user_speak where userid="${message.member.id}";`);
        const dictionary = await sql(`select * from dictionary where guildid="${message.guild.id}";`);
        const speaker = (get_server_data[0]?.force_voice) ? get_server_data[0]?.speakid || getdata[0]?.speakid || 3 : getdata[0]?.speakid || get_server_data[0]?.speakid || 3;
        const host = (get_server_data[0]?.force_voice) ? get_server_data[0]?.speakhost || getdata[0]?.speakhost || process.env.voicevox : getdata[0]?.speakphost || get_server_data[0]?.speakhost || process.env.voicevox;
        const name = (get_server_data[0]?.force_voice) ? get_server_data[0]?.speakname || getdata[0]?.speakname || "ずんだもん" : getdata[0]?.speakname || get_server_data[0]?.speakname || "ずんだもん";
        const speed = (get_server_data[0]?.force_args) ? get_server_data[0]?.speed || getdata[0]?.speed || 1 : getdata[0]?.speed || get_server_data[0]?.speed || 1;
        const pitch = (get_server_data[0]?.force_args) ? get_server_data[0]?.pitch || getdata[0]?.pitch || 0 : getdata[0]?.pitch || get_server_data[0]?.pitch || 0;
        const intonation = (get_server_data[0]?.force_args) ? get_server_data[0]?.intonation || getdata[0]?.intonation || 1 : getdata[0]?.intonation || get_server_data[0]?.intonation || 1;
        const not_exvoice = (await sql(`select * from exvoiceword where guildid="${message.guild.id}" and speakname="${name}";`)).map(data => data.word);
        const exvoice = (exvoice_list[name]) ? exvoice_list[name].filter(item => !not_exvoice.includes(item)) : null
        const before_msg = (get_server_data[0]?.read_username && !get_server_data[0]?.dictionary_username) ? `${user}さんのメッセージ　${live_content}` : live_content;
        const romajimsg = before_msg.replace(/((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi, 'リンク省略');
        const code = romajimsg.replace(/```[\s\S]*?```/gi, "コード省略");
        const wara = code.replace(/w|ｗ|W|Ｗ/g, "わら");
        const tmpfile = tmp ? "添付ファイル" + wara : wara;
        const format_msg = await axios.get(`https://eng-jpn-api.kuroneko6423.com/query?text=${tmpfile}`, {
            httpAgent: new http.Agent({ keepAlive: true, timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets) }),
        }).catch((ex) => { });
        const msg = (format_msg.data) ? format_msg.data : romajimsg;
        const check = exvoice?.find(str => msg.includes(str));
        if (exvoice && check && !get_server_data[0]?.exvoice) {
            const matchStr = exvoice?.find(str => msg.includes(str)); // 配列内に一致する要素を検索する
            const result = msg.substring(msg.indexOf(matchStr), msg.indexOf(matchStr) + matchStr.length);
            const array = msg.split(result)//result を基準に文字列を分割する
            const splitResult = [array.shift(), array.join(result)];
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
                (splitResult.join("").length >= max_message) ? `${splitResult[1].slice(0, (max_message - splitResult[0].length <= 0) ? 0 : max_message - splitResult[0].length)}以下省略` : splitResult[1] :
                (string_array.join("").length >= max_message) ? `${string_array[1].slice(0, (max_message - string_array[0].length <= 0) ? 0 : max_message - string_array[0].length)}以下省略` : string_array[1];
            const start_content = (string_array.length === 0) ? splitResult[0] : string_array[0];
            const text = (get_server_data[0]?.read_username && get_server_data[0]?.dictionary_username) ?
                `${user}さんのメッセージ　${start_content}` : start_content;
            const audio_query_response_start = await axios.post(`${host}/audio_query?text=${text}&speaker=${speaker}`, {
                httpAgent: new http.Agent({ keepAlive: true , timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets)}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const audio_query_response_last = await axios.post(`${host}/audio_query?text=${last_content}&speaker=${speaker}`, {
                httpAgent: new http.Agent({ keepAlive: true , timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets)}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const buffer_array = [];
            await Promise.all([...Array(2)].map(async (_, index) => {
                const audio_query_json = (index === 0) ? await audio_query_response_start?.data : await audio_query_response_last?.data;
                audio_query_json["speedScale"] = speed;
                audio_query_json["pitchScale"] = pitch;
                audio_query_json["intonationScale"] = intonation;
                const synthesis_response = await axios.post(`${host}/synthesis?speaker=${speaker}`, audio_query_json, {
                    httpAgent: new http.Agent({ keepAlive: true , timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets)}),
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'audio/wav'
                    },
                    responseType: 'arraybuffer'
                });
                if (!synthesis_response?.data) return;
                const synthesis_response_buf = await synthesis_response.data;
                buffer_array.push(Buffer.from(synthesis_response_buf, "base64").toString("base64"));
            }));
            const exvoice_file = fs.readFileSync(`${process.env.exvoice}/${name}/${result}.wav`).toString("base64");
            buffer_array.splice(1, 0, exvoice_file);
            const response = await axios.post(
                `${host}/connect_waves`,
                buffer_array,
                {
                    httpAgent: new http.Agent({ keepAlive: true , timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets)}),
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
            if (skip) {
                player.stop();
            };
            await new Promise(resolve => {
                const subscription = voiceChannel.state.subscription;
                if (subscription && subscription.player.state.status !== AudioPlayerStatus.Idle) {
                    subscription.player.once('idle', () => resolve());
                } else resolve();
            });
            const resource = createAudioResource(bufferStream);
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
            const text = (get_server_data[0]?.read_username && get_server_data[0]?.dictionary_username) ?
                `${user}さんのメッセージ　${content}` : content;
            const audio_query_response = await axios.post(`${host}/audio_query?text=${text}&speaker=${speaker}`, {
                timeout: timeout * 1000,
                httpAgent: new http.Agent({ keepAlive: true, timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets) }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const audio_query_json = await audio_query_response.data;
            audio_query_json["speedScale"] = speed;
            audio_query_json["pitchScale"] = pitch;
            audio_query_json["intonationScale"] = intonation;
            const synthesis_response = await axios.post(`${host}/synthesis?speaker=${speaker}`, audio_query_json, {
                httpAgent: new http.Agent({ keepAlive: true, timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets) }),
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'audio/wav'
                },
                responseType: 'arraybuffer'
            });
            if (!synthesis_response.data) return;
            const synthesis_response_buf = Buffer.from(await synthesis_response.data, "base64");
            const bufferStream = new Readable();
            bufferStream.push(synthesis_response_buf);
            bufferStream.push(null);
            const voiceChannel = getVoiceConnection(message.guild.id);
            if (!voiceChannel) return;
            const player = createAudioPlayer();
            if (skip) {
                player.stop();
            };
            await new Promise(resolve => {
                const subscription = voiceChannel.state.subscription;
                if (subscription && subscription.player.state.status !== AudioPlayerStatus.Idle) {
                    subscription.player.removeAllListeners('idle');
                    subscription.player.once('idle', () => resolve());
                } else resolve();
            });
            const resource = createAudioResource(bufferStream);
            player.play(resource);
            voiceChannel.subscribe(player);
        };
    }
};