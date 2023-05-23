const { Colors } = require("discord.js");
const { EmbedPages } = require("../../libs");

const pagePerCommand = 10;

module.exports = {
    builder: (builder) => builder
        .setName("help")
        .setDescription("ヘルプの表示")
        .addStringOption(option => option
            .setName("commandname")
            .setDescription("指定されたコマンドの詳細を表示します。")
            /* SlashCommandHandlerに実装している
            .setChoices(...{ name: command.data.name, value: `/${command.data.name}`})
            */
        )
    ,
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        await interaction.respond(all_voice_list.filter(data => data.name.startsWith(focusedValue))).catch(() => { });
    },
    execute(interaction) {
        const { commands } = interaction.client;
        const commandName = interaction.options.getString("commandname");
        if (!commandName) {
            const categoryCommands = {};
            commands.forEach((command) => {
                if (!categoryCommands[command.category]) {
                    categoryCommands[command.category] = [];
                }
                const commandList = [`\`/${command.data.name}\` - ${command.data.description}`];
                if ("subcommands" in command) {
                    command.subcommands.forEach((subcommand) => {
                        commandList.push(`> \`/${command.data.name} ${subcommand.data.name}\` - ${subcommand.data.description}`);
                    });
                }
                categoryCommands[command.category].push(commandList);
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
                                categoryValue.push("> ... (次のページへ)");
                                nextPage();
                            }
                        }
                    }
                });

                currentPage.fields.push({ name: category, values: categoryValue });
            });
            if (currentPage.length !== 0) pagesField.push(currentPage.fields);
            const embedPages = new EmbedPages("help").setColor(Colors.Gold);
            pagesField.forEach((page) => {
                embedPages.addPage((embed) => {
                    embed.addFields(page.map((field) => ({ name: field.name, value: field.values.join("\n") })));
                });
            });
            embedPages.run(interaction);
        } else {

        }
    }
}