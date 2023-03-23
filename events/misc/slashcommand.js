const { Events, EmbedBuilder, Colors } = require('discord.js');
const chalk = require('chalk');
const permissions_embed = new EmbedBuilder()
    .setTitle("⚠️エラー")
    .setDescription("権限が足りません。\nBOTに権限を与えてください")
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | SlashCommand" })
    .setColor(Colors.Red);
const { send } = require("../../helpers/sendwebhook");
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
            console.log(chalk.red(`[エラー] ${err.message}`));
            if (err.message === "Missing Permissions") return await interaction.reply({ embeds: [permissions_embed], ephemeral: true }).catch(() => { });
            send({ title: "interactionエラー", description: `${err.message}`, time: new Date(), color: Colors.Red });
            const unknown_embed = new EmbedBuilder()
                .setTitle("⚠️エラー")
                .setDescription(`不明なエラーが発生しました。\n詳細:${err.message}\n運営に問い合わせていただけると幸いです。`)
                .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | SlashCommand" })
                .setColor(Colors.Red);
            await interaction.reply({ embeds: [unknown_embed], ephemeral: true }).catch(() => { });
        };
    }
};