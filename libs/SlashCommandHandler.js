const { Collection, REST, Routes, SlashCommandBuilder, SlashCommandSubcommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const logger = require("./GetLogger");

function SlashCommandHandler(commandsPath) {
    const Log = logger.createChannel("command");
    Log.info("Loading...");
    const commands = new Collection();
    fs.readdirSync(commandsPath).forEach((categoryDir) => {
        Log.debug(`Loading category ${categoryDir}...`);
        const categoryPath = path.resolve(commandsPath, categoryDir);
        const categoryLog = Log.createChild(categoryDir);
        const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            Log.debug(`Loading command ${categoryDir} ${file}...`);
            const commandPath = path.resolve(categoryPath, file);
            const command = require(commandPath);
            const commandBuilder = command.builder(new SlashCommandBuilder());
            const name = commandBuilder.name;
            command.logger = categoryLog.createChild(name);
            if ("subcommands" in command) {
                Log.debug(`Loading subcommands for ${categoryDir} ${file}...`);
                const subcommands = [];
                if (typeof command.subcommands === "string") {
                    const subcommandFiles = fs.readdirSync(path.resolve(categoryPath, command.subcommands)).filter(file => file.endsWith(".js"));
                    for (const subcommandFile of subcommandFiles) {
                        const subcommandPath = path.resolve(categoryPath, command.subcommands, subcommandFile);
                        subcommands.push(require(subcommandPath));
                    }
                } else {
                    command.subcommands.forEach(subcommand => subcommands.push(subcommand));
                }
                command.subcommands = new Collection();
                subcommands.forEach(subcommand => {
                    const subcommandBuilder = subcommand.builder(new SlashCommandSubcommandBuilder());
                    commandBuilder.addSubcommand(subcommandBuilder);
                    subcommand.logger = command.logger.createChild(subcommandBuilder.name);
                    subcommand.data = subcommandBuilder.toJSON();
                    command.subcommands.set(subcommandBuilder.name, subcommand);
                });
                Log.debug(`Loaded ${subcommands.size} subcommands for ${categoryDir} ${file}`);
            }
            command.data = commandBuilder.toJSON();
            commands.set(command.data.name, command);
            Log.debug(`Loaded command ${categoryDir} ${file}`);
        }
        Log.debug(`Loaded category ${categoryDir} ${commandFiles.length} commands`);
    });
    Log.info(`Loaded ${commands.size} commands`);
    Log.info("Deploying...");
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    rest.put(
        Routes.applicationCommands(process.env.clientId),
        { body: commands.map(command => command.data) },
    ).then((data) => {
        Log.info(`Deployed ${data.length} commands`);
    }).catch((error) => {
        Log.error(error)
    });
    return commands;
}

module.exports = SlashCommandHandler;