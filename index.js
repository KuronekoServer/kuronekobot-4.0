const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { EnkaClient } = require("enka-network-api");
const path = require("path");
const axios = require("axios");
const chalk = require("chalk");

const { EventHandler, CommandsBuilder } = require("./libs");
const logger = require("./helpers/getLogger");

const { config } = require("./config");

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    allowedMentions: { repliedUser: false },
    rest: 60000
});
client.logger = logger;

const Log = logger.createChannel("main");

EventHandler(client, path.resolve(__dirname, "./events"));
client.commands = CommandsBuilder(client, path.resolve(__dirname, "./commands"));

globalThis.voice_channel = [];
globalThis.ylivechat = {};
globalThis.tlivechat = {};

const enka = new EnkaClient({ showFetchCacheLog: true });


process.on("uncaughtException", (error) => {
    Log.error(error)
});

client.login(config.discordToken);