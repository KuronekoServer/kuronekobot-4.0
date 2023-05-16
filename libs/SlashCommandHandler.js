const { Collection, REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
const logger = require("./GetLogger");
const option = require("../helpers/optionslash.json");

function SlashCommandHandler(commandsPath) {
    const Log = logger.createChannel("command");
    Log.debug("Loading...");
    const commands = new Collection();
    fs.readdirSync(commandsPath).forEach((categoryDir) => {
        const categoryPath = path.resolve(commandsPath, categoryDir);
        const categoryLog = Log.createChild(categoryDir);
        const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const commandPath = path.resolve(categoryPath, file);
            const command = require(commandPath);
            if (!("data" in command) || !("execute" in command)) {
                Log.warn(`${commandPath}はdataかexecuteプロパティが設定されていないため、ロードしていません。`);
                return;
            }
            const name = command.data.name;
            command.logger = categoryLog.createChild(name);
            commands.set(name, command);            
        }
    });
    Log.debug(`Loaded ${commands.size} commands`);
    Log.debug("Deploying...");
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    rest.put(
        Routes.applicationCommands(process.env.clientId),
        { body: [option, ...commands.map(command => command.data.toJSON())] },
    ).then((data) => {
        Log.debug(`Deployed ${data.length} commands`);
    }).catch(Log.error);
    return commands;
}

module.exports = SlashCommandHandler;