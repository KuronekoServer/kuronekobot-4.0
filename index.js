
const { Client, GatewayIntentBits, Partials, WebhookClient } = require("discord.js");
const { EnkaClient } = require("enka-network-api");
const path = require("path");
const axios = require("axios");
const chalk = require("chalk");

const {
    Logger,
    EventHandler,
    SlashCommandHandler
} = require("./libs");

require("dotenv").config();

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    rest: 60000
});

const errorWebhook = new WebhookClient({ url: process.env.errorwebhook });
const logQueue = ["接続しました。"];
setInterval(() => {
    if (logQueue.length === 0) return;
    let data = logQueue.shift();
    if (data.length > 2000) {
        logQueue.unshift(data.slice(2000));
        data = data.slice(0, 2000);
    } else {
        for (let i = 0;logQueue.length > 0;i++) {
            if (data.length + logQueue[0].length > 1999) break;
            data += "\n" + logQueue.shift();
        }
    }
    errorWebhook.send(data).catch((error) => { console.error(error) });
}, 1000);
const logger = new Logger({
    levels: ["info", "warn", "error", "debug"],
    writeLog(data) {
        let { lines, level: _level, time, location } = data;
        const errors = lines.filter(line => line instanceof Error);
        if (errors.length > 0) {
            const lineStr = errors
                .map(error => error.message + "\n" + error.stack)
                .join("\n");
            lines = [ "\n" + lineStr ];
        }
        let level = `[${_level}]`;
        logQueue.push(`[${time}][${location.join("][")}] ${level} ${lines}`);
        switch (_level) {
            case "INFO":
                break;
            case "WARN":
                level = chalk.magenta(level);
                break;
            case "ERROR":
                level = chalk.red(level);
                break;
            case "DEBUG":
                level = chalk.yellow(level);
                break;
        }
        console.log(`[${time}][${location.join("][")}] ${level} ${lines}`);
    }
});
const Log = logger.createChannel("main");
client.logger = logger;

EventHandler(client, path.resolve(__dirname, "./events"));
client.commands = SlashCommandHandler(client, path.resolve(__dirname, "./commands"));

globalThis.voice_channel = [];
globalThis.ylivechat = {};
globalThis.tlivechat = {};

const enka = new EnkaClient({ showFetchCacheLog: true });

setInterval(() => {
    axios.get(process.env.URL)
        .then(response => {
            Log.info(`[GETリクエスト] ${response.config.url} - ステータスコード: ${response.status}`);
        })
        .catch(error => {
            Log.warn(`[GETリクエスト] ${error.config.url} - ${error.message}`)
        });
}, 10 * 1000);

process.on("uncaughtException", (error) => {
    Log.error(error)
});

client.login(process.env.TOKEN);
