const { Events } = require('discord.js');
const { Command } = require('../../libs');
const commandHandler = require('../../helpers/commandHandler');

module.exports = {
    name: Events.InteractionCreate,
    filter: (i) => i.isCommand() || i.isAutocomplete(),
    async execute(interaction) {
        const command = new Command.SlashCommandManager(interaction);

        if (interaction.isCommand()) {            
            if (!("execute" in command)) return;
            commandHandler(command);
        } else {
            if (!("autocomplete" in command)) return;
            const result = await command.autocomplete(command);
            interaction.respond(result);
        }
    }
};