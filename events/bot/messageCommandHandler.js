const { ActionRowBuilder, Events, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Command } = require('../../libs');
const commandHandler = require('../../helpers/commandHandler');
const config = require('../../config');

module.exports = {
    name: Events.MessageCreate,
    filter: (m) => m.content.startsWith(config.prefix),
    async execute(message) {
        const command = new Command.MessageCommandManager(message);

        const autocompleteOptions = command.options.data.filter((o) => o.autocomplete);
        if (autocompleteOptions.length) {
            let autocompleteMenu = [];
            for (const option of autocompleteOptions) {
                const index = command.options._hoistedOptions.findIndex((o) => o.name === option.name);
                command.options._hoistedOptions[index].focused = true;
                const optionData = await command.autocomplete(command);
                command.options._hoistedOptions[index].focused = false;
                if (!optionData.length) continue;
                if (option.value === optionData[0].value) continue;
                autocompleteMenu.push(new StringSelectMenuBuilder()
                    .setCustomId(`options_select_${option.name}`)
                    .setPlaceholder(`${option.name}のオプションを選択`)
                    .addOptions(new StringSelectMenuOptionBuilder()
                        .setLabel(option.value)
                        .setValue(option.value)
                    )
                    .addOptions(optionData.map((o, index) => new StringSelectMenuOptionBuilder()
                        .setLabel(o.name)
                        .setValue(o.value)
                    )));
            }

            if (autocompleteMenu.length) {
                const component = new ActionRowBuilder()
			        .addComponents(autocompleteMenu);

                const msg = await command.reply({
                    content: 'オプションを選択してください',
                    components: [component]
                })
                let error = false;
                await msg.awaitMessageComponent({ filter: (i) => i.user.id === message.author.id, time: 60 * 1000 })
                    .then((i) => {
                        const option = command.options.data.findIndex((o) => o.name === i.customId.slice(15));
                        command.options.data[option].value = i.values[0];
                    })
                    .catch((err) => {
                        error = true;
                    });
                msg.delete();
                if (error) return;
            }
        }
        if (!("execute" in command)) return;
        commandHandler(command);
    }
};