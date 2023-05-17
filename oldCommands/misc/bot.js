const { SlashCommandBuilder } = require('discord.js');
const status = require("./bot/status");
const report = require("./bot/report");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("bot関連系")
        .addSubcommand(subcommand =>
            subcommand
                .setName("status")
                .setDescription("BOTのステータスを表示します")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("report")
                .setDescription("バグや要望を運営に送信します")
        ),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        //status
        if (sub === "status") {
            await status(interaction);
        };
        //report
        if (sub === "report") {
            await report(interaction);
        };
    }
}