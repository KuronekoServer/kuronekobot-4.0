const http = require("http");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require("@discordjs/voice");

const { SQL } = require("../libs");

const { sql } = require("../libs/Utils");
const { escape } = require("mysql2")

const exvoice_list = {};
const config = require("../config");

const {
    timeout,
    maxMessage,
    maxFreeSockets,
    maxTotalSockets,
    maxSockets
} = config.speak;

const hosts = {
    voicevox: config.speak.voicevox,
    coeiroink: config.speak.coeiroink,
    sharevox: config.speak.sharevox
};

const defaultQuery = {
    speaker: 3,
    host: hosts.voicevox,
    name: "ずんだもん",
    speed: 1,
    pitch: 0,
    intonation: 1
};

fs.readdirSync(config.speak.exvoice).forEach(data => {
    exvoice_list[data] = [];
    fs.readdirSync(path.resolve(config.speak.exvoice, data))
        .forEach((name) => {
            if (name.endsWith(".wav")) exvoice_list[data].push(name);
        });
});

module.exports = {
    async read(message, user, liveContent, skip, tmp) {
        const guildid = message.guild.id;

        const serverData = await SQL.select("server_speak", { guildid });
        const userData = await SQL.select("user_speak", { userid: message.member.id });
        const dictionaryData = await SQL.select("dictionary", { guildid });
        const globalDictionaryData = await SQL.select("globaldictionary");
        const dictionary = dictionaryData[0]?.map(c => c).concat(globalDictionaryData[0]).map(a => a)[0];

        const get_server_data = await sql(`select * from server_speak where guildid=${escape(message.guild.id)};`);

        const serverQuery = Object.assign({}, defaultQuery, serverData[0][0]);
        const userQuery = Object.assign({}, defaultQuery, userData[0][0]);
        const query = {};
        if (serverData[0][0]?.force_voice) {
            query.speaker = serverQuery.speakid;
            query.host = serverQuery.speakhost;
            query.name = serverQuery.speakname;
        } else {
            query.speaker = userQuery.speakid;
            query.host = userQuery.speakhost;
            query.name = userQuery.speakname;
        }
        if (serverData[0][0]?.force_args) {
            query.speed = serverQuery.speed;
            query.pitch = serverQuery.pitch;
            query.intonation = serverQuery.intone;
        } else {
            query.speed = userQuery.speed;
            query.pitch = userQuery.pitch;
            query.intonation = userQuery.intone;
        }

        const exvoiceData = await SQL.sql(`SELECT * FROM exvoiceword WHERE guildid=${escape(message.guild.id)} and speakname=${escape(query.name)};`);
        const notExvoice = exvoiceData[0].map(data => data.word);
        const exvoice = (exvoice_list[query.name]) ? exvoice_list[query.name].filter(item => !notExvoice.includes(item)) : null;

        let speakText = liveContent;
        if (serverData[0][0]?.read_username && !serverData[0][0]?.dictionary_username) speakText = `${user}さんのメッセージ ${liveContent}`;
        speakText
            .replace(/(https?|ftp):\/\/[\w\/:%#\$\&\?\(\)~\.=\+\-]+/gi, "リンク省略")
            .replace(/```[\s\S]*?```/gi, "コード省略");
        const speakData = await axios.get(`https://eng-jpn-api.kuroneko6423.com/query?text=${speakText}`, {
            httpAgent,
        }).catch((error) => { });
        if (speakData.data) speakText = speakData.data;
        else speakText = speakText.replace(/w|W|ｗ|Ｗ/g, "わら");
        if (tmp) speakText = `添付ファイル ${speakText}`;

        const matchStr = exvoice?.find(str => speakText.includes(str));

        const instance = axios.create({
            baseURL: query.host,
            httpAgent: new http.Agent({
                keepAlive: true,
                timeout: timeout * 1000,
                keepAliveMsecs: Infinity,
                maxFreeSockets,
                maxTotalSockets, 
                maxSockets
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (exvoice && matchStr && !serverData[0][0]?.exvoice) {
            const result = speakText.substring(speakText.indexOf(matchStr), speakText.indexOf(matchStr) + matchStr.length);
            const array = speakText.split(result);
            const splitResult = [array.shift(), array.join(result)];
            let stringArray = [];
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
                    stringArray.push(newString.replace(stringArray[0], ""));
                };
            }));
            const last_content = (stringArray.length === 0) ?
                (splitResult.join("").length >= maxMessage) ? `${splitResult[1].slice(0, (maxMessage - splitResult[0].length <= 0) ? 0 : maxMessage - splitResult[0].length)}以下省略` : splitResult[1] :
                (stringArray.join("").length >= maxMessage) ? `${stringArray[1].slice(0, (maxMessage - stringArray[0].length <= 0) ? 0 : maxMessage - stringArray[0].length)}以下省略` : stringArray[1];
            const start_content = (stringArray.length === 0) ? splitResult[0] : stringArray[0];
            const text = (serverData[0][0]?.read_username && serverData[0][0]?.dictionary_username) ? `${query.user}さんのメッセージ ${start_content}` : start_content;
            
            const audioQueryStart = await instance.post(`/audio_query?text=${text}&speaker=${query.speaker}`);
            const audioQueryLast = await instance.post(`/audio_query?text=${last_content}&speaker=${query.speaker}`);
            const bufferArray = [];
            async function readmsg(audioQuery) {
                audioQuery["speedScale"] = query.speed;
                audioQuery["pitchScale"] = query.pitch;
                audioQuery["intonationScale"] = query.intonation;
                const synthesis = await instance.post(`/synthesis?speaker=${query.speaker}`, audioQuery, {
                    headers: { accept: "audio/wav" },
                    responseType: "arraybuffer",
                });
                if (!synthesis?.data) return;
                bufferArray.push(synthesis?.data.toString("base64"));
            };
            await readmsg(audioQueryStart?.data);
            await readmsg(audioQueryLast?.data);
            const exvoiceFile = fs.readFileSync(`${config.speak.exvoice}/${query.name}/${result}.wav`).toString("base64");
            bufferArray.splice(1, 0, exvoiceFile);
            const response = await instance.post("/connect_waves", bufferArray, {
                headers: { accept: "audio/wav" },
                responseType: "stream"
            });
            if (!response.data) return;
            const voiceChannel = getVoiceConnection(guildid);
            const player = createAudioPlayer();
            if (!voiceChannel) return;
            if (skip) {
                player.stop();
            };
            await new Promise(resolve => {
                const subscription = voiceChannel.state.subscription;
                if (subscription && subscription.player.state.status !== AudioPlayerStatus.Idle) {
                    subscription.player.once("idle", () => resolve());
                } else resolve();
            });
            const resource = createAudioResource(response.data);
            player.play(resource);
            voiceChannel.subscribe(player);
        } else {
            let newString = speakText;
            if (dictionary?.length !== 0) {
                for (let i = 0; i < dictionary.length; i++) {
                    const before = dictionary[i].before_text;
                    const after = dictionary[i].after_text;
                    const regex = new RegExp(before, 'g');
                    newString = newString.replace(regex, after);
                };
            };
            const content = (newString === "") ?
                (speakText.length >= maxMessage) ? `${speakText.slice(0, maxMessage)}以下省略` : speakText :
                (newString.length >= maxMessage) ? `${newString.slice(0, maxMessage)}以下省略` : newString;
            const text = (serverData[0][0]?.read_username && serverData[0][0]?.dictionary_username) ? `${user}さんのメッセージ ${content}` : content;
            const audioQueryResponse = await instance.post(`/audio_query?text=${text}&speaker=${query.speaker}`);
            const audioQuery = await audioQueryResponse.data;
            audioQuery["speedScale"] =  query.speed;
            audioQuery["pitchScale"] = query.pitch;
            audioQuery["intonationScale"] = query.intonation;
            const synthesis = await instance.post(`/synthesis?speaker=${query.speaker}`, audioQuery, {
                headers: { accept: "audio/wav" },
                responseType: "stream"
            });
            if (!synthesis.data) return;
            const voiceChannel = getVoiceConnection(guildid);
            if (!voiceChannel) return;
            const player = createAudioPlayer();
            if (skip) {
                player.stop();
            };
            await new Promise(resolve => {
                const subscription = voiceChannel.state.subscription;
                if (subscription && subscription.player.state.status !== AudioPlayerStatus.Idle) {
                    subscription.player.removeAllListeners("idle");
                    subscription.player.once("idle", () => resolve());
                } else resolve();
            });
            const resource = createAudioResource(synthesis.data);
            player.play(resource);
            voiceChannel.subscribe(player);
        };
    }
};