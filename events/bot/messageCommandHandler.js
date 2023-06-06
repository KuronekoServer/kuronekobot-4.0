const { ActionRowBuilder, Events, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Command } = require('../../libs');
const commandHandler = require('../../helpers/commandHandler');
const config = require('../../config');

module.exports = {
    name: Events.MessageCreate,
    filter: (m) => m.content.startsWith(config.prefix),
    async execute(message) {
        const command = new Command.MessageCommandManager(message);

        if (command.autocomplete) {
            let autocompleteMenu = await Promise.all(command.options.data.map(async (option) => {
                if (!option.autocomplete) return;
                const index = command.options._hoistedOptions.findIndex((o) => o.name === option.name);
                command.options._hoistedOptions[index].focused = true;
                const result = await command.autocomplete(command);
                command.options._hoistedOptions[index].focused = false;
                if ((result ?? []).length === 0) return;
                if (!result.includes(option.value)) result.unshift({ name: option.value, value: option.value });
                if (result.length === 1) return;
                return new StringSelectMenuBuilder()
                    .setCustomId(`options_select_${option.name}`)
                    .setPlaceholder(`${option.name}のオプションを選択`)
                    .addOptions(result.map((o) => new StringSelectMenuOptionBuilder()
                        .setLabel(o.name)
                        .setValue(o.value)
                    ));
            }));
            autocompleteMenu = autocompleteMenu.filter((o) => Boolean);
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
                    .catch(() => {
                        error = true;
                    });
                msg.delete();
                if (error) return;
            }
        }

        if (command.execute) {
            commandHandler(command);
        }
    }
};