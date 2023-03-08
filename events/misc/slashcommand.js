const { Events, EmbedBuilder, Colors } = require('discord.js');
const permissions_embed = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("権限が足りません。\nBOTに権限を与えてください")
    .setColor(Colors.Red);
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
            };
        };

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err.message);
            if (err.message === "Missing Permissions") return await interaction.reply({ embeds: [permissions_embed], ephemeral: true }).catch(() => { });
            await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true }).catch(() => { });
        };
    }
};