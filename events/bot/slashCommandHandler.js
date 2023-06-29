const { Events } = require('discord.js');
const { Command } = require('../../libs');
const commandHandler = require('../../helpers/commandHandler');

module.exports = {
    name: Events.InteractionCreate,
    filter: (i) => i.isCommand() || i.isAutocomplete(),
    async execute(interaction) {
        const command = new Command.SlashCommandManager(interaction);

        if (interaction.isAutocomplete() && command.autocomplete) {
            const result = await command.autocomplete(command);
            if (Array.isArray(result)) interaction.respond(result);
        }

        if (interaction.isCommand() && command.execute) {
            commandHandler(command);
        }
    }
};