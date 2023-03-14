const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { REST, Routes } = require("discord.js");

const { TOKEN, clientId } = process.env;
const option = require("./optionslash.json");

const commands = [];
commands.push(option);
fs.readdirSync(path.resolve(__dirname, "commands")).forEach((dir) => {
    const commandsPath = path.resolve(__dirname, "commands", dir);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    commandFiles.forEach((file) => {
        const commandPath = path.join(commandsPath, file);
        const command = require(commandPath);
        commands.push(command.data.toJSON());
    });
});

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
    try {
        console.log(chalk.green("[ロード開始]"), `${commands.length} 個のアプリケーション (/) コマンドをロードします。`);
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log(chalk.green("[成功]"), `${data.length} 個のアプリケーション (/) コマンドをロードしました。`);
    } catch (error) {
        console.error(error);
    }
})();