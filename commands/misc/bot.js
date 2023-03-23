const { SlashCommandBuilder } = require('discord.js');
const status = require("./bot/status");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("bot関連系")
        .addSubcommand(subcommand =>
            subcommand
                .setName("status")
                .setDescription("BOTのステータスを表示します")
        ),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        //status
        if (sub === "status") {
            await status(interaction);
        };

    }
}