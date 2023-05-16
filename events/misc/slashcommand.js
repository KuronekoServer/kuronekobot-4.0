const { Events, EmbedBuilder, Colors } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const { client } = interaction;

        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.autocomplete(interaction, command.logger);
            } catch (error) {
                command.logger.error(`${error.message}\n${error.stack}`);
            }
        } else {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction, command.logger);
            } catch (error) {
                command.logger.error(`${error.message}\n${error.stack}`);
                const embed = new EmbedBuilder()
                    .setTitle("⚠エラー")
                    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "© 2023 KURONEKOSERVER | SlashCommand" })
                    .setColor(Colors.Red);
                if (error.message === "Missing Permissions") {
                    embed.setDescription("権限が足りません。\nBOTに権限を与えてください")
                    interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => { });
                } else {
                    embed.setDescription(`不明なエラーが発生しました。\n詳細:${error.message}\n運営に問い合わせていただけると幸いです。`)
                    interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => { });
                }
            }
        }
    }
};