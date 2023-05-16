const http = require('http');
const { sql } = require("../libs/Utils");
const { escape } = require("mysql2")
const { createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
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
        const get_server_data = await sql(`select * from server_speak where guildid=${escape(message.guild.id)};`);
        const getdata = await sql(`select * from user_speak where userid=${escape(message.member.id)};`);
        const dictionary = ((await sql(`select * from dictionary where guildid=${escape(message.guild.id)};`))[0]?.map(c => c).concat(((await sql(`select * from globaldictionary;`))[0]).map(a => a)))[0];
        const speaker = (!get_server_data[0][0]?.force_voice) ? get_server_data[0][0]?.speakid || getdata[0][0]?.speakid || 3 : getdata[0][0]?.speakid || get_server_data[0][0]?.speakid || 3;
        const host = (get_server_data[0][0]?.force_voice) ? get_server_data[0][0]?.speakhost || getdata[0][0]?.speakhost || process.env.voicevox : getdata[0][0]?.speakphost || get_server_data[0][0]?.speakhost || process.env.voicevox;
        const name = (get_server_data[0][0]?.force_voice) ? get_server_data[0][0]?.speakname || getdata[0][0]?.speakname || "ずんだもん" : getdata[0][0]?.speakname || get_server_data[0][0]?.speakname || "ずんだもん";
        const speed = (get_server_data[0][0]?.force_args) ? get_server_data[0][0]?.speed || getdata[0][0]?.speed || 1 : getdata[0][0]?.speed || get_server_data[0][0]?.speed || 1;
        const pitch = (get_server_data[0][0]?.force_args) ? get_server_data[0][0]?.pitch || getdata[0][0]?.pitch || 0 : getdata[0][0]?.pitch || get_server_data[0][0]?.pitch || 0;
        const intonation = (get_server_data[0][0]?.force_args) ? get_server_data[0][0]?.intonation || getdata[0][0]?.intonation || 1 : getdata[0][0]?.intonation || get_server_data[0][0]?.intonation || 1;
        const not_exvoice = (await sql(`select * from exvoiceword where guildid=${escape(message.guild.id)} and speakname=${escape(name)};`))[0].map(data => data.word);
        const exvoice = (exvoice_list[name]) ? exvoice_list[name].filter(item => !not_exvoice.includes(item)) : null
        const before_msg = (get_server_data[0][0]?.read_username && !get_server_data[0][0]?.dictionary_username) ? `${user}さんのメッセージ　${live_content}` : live_content;
        const romajimsg = before_msg.replace(/((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi, 'リンク省略');
        const code = romajimsg.replace(/```[\s\S]*?```/gi, "コード省略");
        const wara = code.replace(/w|ｗ|W|Ｗ/g, "わら");
        const tmpfile = tmp ? "添付ファイル" + wara : wara;
        const format_msg = await axios.get(`https://eng-jpn-api.kuroneko6423.com/query?text=${tmpfile}`, {
            httpAgent: new http.Agent({ keepAlive: true, timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets) }),
        }).catch((ex) => { });
        const msg = (format_msg.data) ? format_msg.data : romajimsg;
        const check = exvoice?.find(str => msg.includes(str));
        if (exvoice && check && !get_server_data[0][0]?.exvoice) {
            const matchStr = exvoice?.find(str => msg.includes(str)); // 配列内に一致する要素を検索する
            const result = msg.substring(msg.indexOf(matchStr), msg.indexOf(matchStr) + matchStr.length);
            const array = msg.split(result)//result を基準に文字列を分割する
            const splitResult = [array.shift(), array.join(result)];
            let string_array = [];
            await Promise.all(splitResult?.map(async content => {
                if (dictionary.length !== 0) {
                    let newString = content;
                    if (dictionary?.length !== 0) {
                        for (let i = 0; i < dictionary.length; i++) {
                            const before = dictionary[i].before_text;
                            const after = dictionary[i].after_text;
                            const regex = new RegExp(before, 'g');
                            newString = newString.replace(regex, after);
                        };
                    };
                    string_array.push(newString.replace(string_array[0], ""));
                };
            }));
            const last_content = (string_array.length === 0) ?
                (splitResult.join("").length >= max_message) ? `${splitResult[1].slice(0, (max_message - splitResult[0].length <= 0) ? 0 : max_message - splitResult[0].length)}以下省略` : splitResult[1] :
                (string_array.join("").length >= max_message) ? `${string_array[1].slice(0, (max_message - string_array[0].length <= 0) ? 0 : max_message - string_array[0].length)}以下省略` : string_array[1];
            const start_content = (string_array.length === 0) ? splitResult[0] : string_array[0];
            const text = (get_server_data[0][0]?.read_username && get_server_data[0][0]?.dictionary_username) ?
                `${user}さんのメッセージ　${start_content}` : start_content;
            const audio_query_response_start = await axios.post(`${host}/audio_query?text=${text}&speaker=${speaker}`, {
                httpAgent: new http.Agent({ keepAlive: true, timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets) }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const audio_query_response_last = await axios.post(`${host}/audio_query?text=${last_content}&speaker=${speaker}`, {
                httpAgent: new http.Agent({ keepAlive: true, timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets) }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const buffer_array = [];
            const readmsg = async (audio_query_json) => {
                audio_query_json["speedScale"] = speed;
                audio_query_json["pitchScale"] = pitch;
                audio_query_json["intonationScale"] = intonation;
                const synthesis_response = await axios.post(`${host}/synthesis?speaker=${speaker}`, audio_query_json, {
                    httpAgent: new http.Agent({ keepAlive: true, timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets) }),
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'audio/wav'
                    },
                    'responseType': "arraybuffer",
                });
                if (!synthesis_response?.data) return;
                buffer_array.push(synthesis_response?.data.toString("base64"));
            };
            await readmsg(audio_query_response_start?.data);
            await readmsg(audio_query_response_last?.data);
            const exvoice_file = fs.readFileSync(`${process.env.exvoice}/${name}/${result}.wav`).toString("base64");
            buffer_array.splice(1, 0, exvoice_file);
            const response = await axios.post(
                `${host}/connect_waves`,
                buffer_array,
                {
                    httpAgent: new http.Agent({ keepAlive: true, timeout: timeout * 1000, keepAliveMsecs: Infinity, maxFreeSockets: Number(process.env.maxFreeSockets), maxSockets: Number(process.env.maxSockets), maxTotalSockets: Number(process.env.maxTotalSockets) }),
                    headers: {
                        "accept": "audio/wav",
                        'Content-Type': 'application/json',
                    },
                    'responseType': "stream",
                }
            );
            if (!response.data) return;
            const voiceChannel = getVoiceConnection(message.guild.id);
            const player = createAudioPlayer();
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
            const resource = createAudioResource(response.data);
            player.play(resource);
            voiceChannel.subscribe(player);
        } else {
            let newString = msg;
            if (dictionary?.length !== 0) {
                for (let i = 0; i < dictionary.length; i++) {
                    const before = dictionary[i].before_text;
                    const after = dictionary[i].after_text;
                    const regex = new RegExp(before, 'g');
                    newString = newString.replace(regex, after);
                };
            };
            const content = (newString === "") ?
                (msg.length >= max_message) ? `${msg.slice(0, max_message)}以下省略` : msg :
                (newString.length >= max_message) ? `${newString.slice(0, max_message)}以下省略` : newString;
            const text = (get_server_data[0][0]?.read_username && get_server_data[0][0]?.dictionary_username) ?
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
                'responseType': "stream"
            });
            if (!synthesis_response.data) return;
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
            const resource = createAudioResource(synthesis_response.data);
            player.play(resource);
            voiceChannel.subscribe(player);
        };
    }
};