const { Events, Colors } = require("discord.js");
const { CustomEmbed } = require("../../libs");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        const { client } = interaction;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        if (interaction.isAutocomplete()) {
            if (!command) return;
            try {
                await command.autocomplete(interaction, command.logger);
            } catch (error) {
                command.logger.error(error);
            }
        }
        try {
            const response = await command.execute(interaction, command.logger);
            if (command.subcommands) {
            const subcommand = command.subcommands.get(interaction.options.getSubcommand());
                const args = response ?? [];
                subcommand.execute(interaction, ...args, command.logger);
            }
        } catch (error) {
            command.logger.error(error);
            const embed = new CustomEmbed("error").typeError();
            if (error.message === "Missing Permissions") {
                embed.setDescription("権限が足りません。\nBOTに権限を与えてください")
            } else {
                embed.setDescription(`不明なエラーが発生しました。\n詳細:${error.message}\n運営に問い合わせていただけると幸いです。`)
            }
            interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => { });
        }
    }
};