const fs = require("fs");
const path = require("path");

const { Client, GatewayIntentBits, Collection, Partials, Colors } = require("discord.js");
const { EnkaClient } = require("enka-network-api");
const axios = require("axios");
const chalk = require("chalk");
const { Logger } = require("dd-logger");

require("dotenv").config();

// Loggerのセットアップ
const logger = new Logger({
    levels: ["info", "warn", "error", "debug"],
    writeLog(data) {
        const { lineText, level: _level, time, location } = data;
        let level = `[${_level}]`;
        switch (_level) {
            case "INFO":
                break;
            case "WARN":
                level = chalk.magenta(level);
                break;
            case "ERROR":
                level = chalk.red(level);
                send({
                    title: "エラー",
                    description: `[${location.join("][")}]\n${lineText}`,
                    time: new Date(),
                    color: Colors.DarkRed
                });
                break;
            case "DEBUG":
                level = chalk.yellow(level);
                break;
        }
        
        console.log(`[${time}][${location.join("][")}] ${level} ${lineText}`);
    }
});
const Log = logger.createChannel("main");

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    rest: 60000
});
client.logger = logger;

const { send } = require("./helpers/sendwebhook");
require("./deploy-commands")(Log);

globalThis.voice_channel = [];
globalThis.ylivechat = {};
globalThis.tlivechat = {};

// EnkaNetworkのcacheをアップデートする
const enka = new EnkaClient({ showFetchCacheLog: true });

// イベントハンドラー
client.events = new Collection();
fs.readdirSync("./events/").forEach(async (dir) => {
    const eventsPath = `./events/${dir}`;
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
        const event = require(`${eventsPath}/${file}`);
        client.on(event.name, event.execute);
    };
});

// スラッシュコマンドハンドラー
client.commands = new Collection();
fs.readdirSync("./commands/").forEach(async (dir) => {
    const commandsPath = `./commands/${dir}`;
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = `${commandsPath}/${file}`;
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            Log.warn(`${filePath}はdataかexecuteプロパティが設定されていません。`)
        };
    };
});

// 10秒ごとにURLにGETリクエストを送信する
setInterval(() => {
    axios.get(process.env.URL)
        .then(response => {
            Log.info(`[GETリクエスト] ${response.config.url} - ステータスコード: ${response.status}`);
        })
        .catch(error => {
            Log.warn(`[GETリクエスト] ${error.config.url} - ${error.message}`)
        });
}, 10000);

// エラー後も処理継続
process.on("uncaughtException", (reason, promise) => {
    Log.error(`${reason}`);
});

client.login(process.env.TOKEN);
