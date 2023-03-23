const { Client, GatewayIntentBits, Collection, Partials, Colors } = require('discord.js');
const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});
const chalk = require('chalk');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { send } = require("./helpers/sendwebhook");
require('./deploy-commands.js');
globalThis.voice_channel = [];
globalThis.ylivechat = [];
globalThis.tlivechat = [];
// イベントハンドラー
client.events = new Collection();
fs.readdirSync('./events/').forEach(async dir => {
    const eventsPath = path.join(__dirname, `./events/${dir}`);
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        client.on(event.name, (...args) => event.execute(...args));
    };
});

// スラッシュコマンドハンドラー
client.commands = new Collection();
fs.readdirSync('./commands/').forEach(async dir => {
    const commandsPath = path.join(__dirname, `./commands/${dir}`);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(chalk.red("[警告]"), `${filePath}はdataかexecuteプロパティが設定されていません。`);
        };
    };
});

// 10秒ごとにURLにGETリクエストを送信する
setInterval(() => {
    axios.get(process.env.URL)
        .then(response => {
            console.log(chalk.green(`[GETリクエスト] ${response.config.url} - ステータスコード: ${response.status}`));
        })
        .catch(error => {
            console.log(chalk.red(`[GETリクエストエラー] ${error.config.url} - ${error.message}`));
            send({ title: "GETリクエストエラー", description: `${error.config.url} - ${error.message}`, time: new Date(), color: Colors.DarkRed })
        });
}, 10000);

// エラー後も処理継続
process.on("uncaughtException", (reason, promise) => {
    console.log(chalk.red(`[エラー] ${reason}\n`) + chalk.yellow(`日時:${new Date()}`));
    send({ title: "その他のエラー", description: `[エラー] ${reason}`, time: new Date(), color: Colors.DarkRed })
});

client.login(process.env.TOKEN);