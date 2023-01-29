const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        };

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        };
    }
};