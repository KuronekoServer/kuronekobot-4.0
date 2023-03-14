const { SlashCommandBuilder } = require('discord.js');
const join = require("./speak/join");
const disconnect = require("./speak/disconnect");
let response;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('speak')
        .setDescription('読み上げ関係のコマンド')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription('ボイスチャンネルに参加します。')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('disconnect')
                .setDescription('ボイスチャンネルから退出します。')
        ),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        await interaction.deferReply({ ephemeral: true });
        //join
        if (sub === "join") {
            response = await join(interaction);
        };
        //disconnect
        if (sub === "disconnect") {
            response = await disconnect(interaction);
        };
        await interaction.followUp(response);
    },
};
