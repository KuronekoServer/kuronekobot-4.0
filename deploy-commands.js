const { REST, Routes } = require("discord.js");
const fs = require("fs");
const option = require("./helpers/optionslash.json");

module.exports = async (logger) => {
    const Log = logger.createChild("dep-cmd");

    const commands = [];
    commands.push(option);

    fs.readdirSync("./commands/").forEach(async (dir) => {
        const commandsPath = `./commands/${dir}`;
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`./commands/${dir}/${file}`);
            commands.push(command.data.toJSON());
        };
    });
    
    Log.debug(`${commands.length}個のアプリケーションコマンドをロードしています...`);
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    rest.put(
        Routes.applicationCommands(process.env.clientId),
        { body: commands },
    ).then((data) => {
        Log.debug(`${data.length}個のアプリケーションコマンドをロードしました。`);
    }).catch((error) => {
        Log.error(error.message);
    });
};