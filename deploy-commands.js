const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const { TOKEN, clientId } = process.env;
const chalk = require('chalk');


const commands = [];
fs.readdirSync('./commands/').forEach(async dir => {
    const commandsPath = path.join(__dirname, `./commands/${dir}`);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${dir}/${file}`);
        commands.push(command.data.toJSON());
    };
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

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