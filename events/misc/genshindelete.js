const {  Events } = require('discord.js');
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.customId === "genshindelete") {
            await interaction.message.delete();
        };
    }
}