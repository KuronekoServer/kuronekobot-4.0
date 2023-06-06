const { Colors } = require('discord.js');
const { EmbedPages, CustomEmbed, Command } = require('../../libs');

const pagePerCommand = 10;

module.exports = {
    builder: (builder) => builder
        .setName('help')
        .setDescription('ヘルプの表示')
        .addStringOption(option => option
            .setName('commandname')
            .setDescription('指定されたコマンドの詳細を表示します。')
            .setAutocomplete(true)
        )
    ,
    autocomplete(command) {
        const commandName = command.options.getFocused();
        const completeNames = command.client.commands.reduce(
            (acc, cmd) => {
                if (cmd.name.startsWith(commandName)) {
                    acc.push(cmd.name);
                    if (cmd.subcommands) acc.push(...cmd.subcommands.map((subcommand) => `${cmd.name} ${subcommand.name}`));
                } else if (cmd.subcommands) {
                    cmd.subcommands.forEach((subcommand) => {
                        if (subcommand.name.startsWith(commandName)) {
                            acc.push(`${cmd.name} ${subcommand.name}`);
                        }
                    });
                }
                return acc;
            },
            []
        );
        return completeNames.map((name) => ({ name, value: name }));
    },
    execute(command) {
        const { commands } = command.client;
        const commandName = command.options.getString('commandname');
        if (!commandName) {
            const categoryCommands = {};
            commands.forEach((cmd) => {
                if (!categoryCommands[cmd.category]) {
                    categoryCommands[cmd.category] = [];
                }
                const commandList = [`\`/${cmd.name}\` - ${cmd.description}`];
                if ('subcommands' in cmd) {
                    cmd.subcommands.forEach((subcommand) => {
                        commandList.push(`> \`/${cmd.name} ${subcommand.name}\` - ${subcommand.description}`);
                    });
                }
                categoryCommands[cmd.category].push(commandList);
            });
            const pagesField = [];
            let currentPage = { fields: [], length: 0 };
            Object.entries(categoryCommands).forEach(([category, categoryCommands]) => {
                let leftItemCount = pagePerCommand - currentPage.length;
                let categoryValue = [];

                function nextPage() {
                    currentPage.fields.push({ name: category, values: categoryValue });
                    pagesField.push(currentPage.fields);
                    currentPage = { fields: [], length: 0 };
                    leftItemCount = pagePerCommand;
                    categoryValue = [];
                }

                categoryCommands.forEach((commands) => {
                    if (commands.length <= leftItemCount) {
                        categoryValue.push(...commands);
                        currentPage.length += commands.length;
                        leftItemCount -= commands.length;
                        if (leftItemCount === 0) nextPage();
                    } else {
                        if (leftItemCount === 1) nextPage();
                        for (let i = 0; i < commands.length; i++) {
                            categoryValue.push(commands[i]);
                            currentPage.length++;
                            leftItemCount--;
                            if (leftItemCount === 0) {
                                categoryValue.push('> ... (次のページへ)');
                                nextPage();
                            }
                        }
                    }
                });

                currentPage.fields.push({ name: category, values: categoryValue });
            });
            if (currentPage.length !== 0) pagesField.push(currentPage.fields);
            const embedPages = new EmbedPages('help').setColor(Colors.Gold);
            pagesField.forEach((page) => {
                embedPages.addPage((embed) => {
                    embed.addFields(page.map((field) => ({ name: field.name, value: field.values.join('\n') })));
                });
            });
            embedPages.run(command);
        } else {
            const showCommand = commands.find((cmd) => cmd.name === commandName);
            if (!showCommand) return command.reply(`'${commandName}'というコマンドが見つかりませんでした。`);
            const embed = new CustomEmbed('help')
                .setName(`${showCommand.prefix}${commandName} の詳細`)
                .setColor(Colors.Orange)
                .addFields(
                    {
                        name: '説明',
                        value: showCommand.description
                    },
                    {
                        name: '引数',
                        value:
                            showCommand.options.map((option, index) => `[${index + 1}] \`${option.name}\` - ${option.description}`).join('\n') +
                            (command.type === Command.Managers.Message) ?
                                '\n\n' +
                                '引数は以下のように指定します。\n' +
                                '空白やコロンが引数に含まれる場合は、引数をダブルクォーテーションで囲ってください。\n' +
                                `\`${command.prefix}コマンド名 引数1 引数2 ...\`\n\`` +
                                `\`${command.prefix}コマンド名 名前1:引数1 名前2: 引数2\`\n` +
                                `\`${command.prefix}コマンド名 名前3:引数3 名前1:引数1 名前2:引数2\``
                            : ''
                    },
                )
        }
    }
}