const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");

require("dotenv").config();

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

require("./deploy-commands.js");

// EventHandler
client.events = new Collection();
fs.readdirSync(path.resolve(__dirname, "events")).forEach((dir) => {
    const eventsPath = path.resolve(__dirname, "events", dir);
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));
    eventFiles.forEach((file) => {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        client.on(event.name, (...args) => event.execute(...args));
    });
});

// SlashCommandHandler
client.commands = new Collection();
fs.readdirSync(path.resolve(__dirname, "commands")).forEach((dir) => {
    const commandsPath = path.resolve(__dirname, "commands", dir);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    commandFiles.forEach((file) => {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(chalk.red("[警告]"), `${filePath}はdataかexecuteプロパティが設定されていません。`);
        }
    });
});

// ErrorHandler
process.on("uncaughtException", (reason, promise) => {
    console.log(chalk.red(`[エラー] ${reason}`));
});

client.login(process.env.TOKEN);