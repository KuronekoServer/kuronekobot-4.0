const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { EnkaClient } = require("enka-network-api");
const path = require("path");
const axios = require("axios");
const chalk = require("chalk");

const {
    GetLogger: logger,
    EventHandler,
    SlashCommandHandler
} = require("./libs");

require("dotenv").config();

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    allowedMentions: { repliedUser: false },
    rest: 60000
});

const Log = logger.createChannel("main");

EventHandler(client, path.resolve(__dirname, "./events"));
client.commands = SlashCommandHandler(path.resolve(__dirname, "./commands"));

globalThis.voice_channel = [];
globalThis.ylivechat = {};
globalThis.tlivechat = {};

const enka = new EnkaClient({ showFetchCacheLog: true });

//死活監視
if (process.env.URL) {
    Log.info("死活監視を開始します。");
    setInterval(() => {
        axios.get(process.env.URL)
            .then(response => {
                console.log(`[GETリクエスト] ${response.config.url} - ステータスコード: ${response.status}`);
            })
            .catch(error => {
                console.log(chalk.red(`[GETリクエスト] ${error.config.url} - ${error.message}`))
            });
    }, 10 * 1000);   
}

process.on("uncaughtException", (error) => {
    Log.error(error)
});

client.login(process.env.TOKEN);