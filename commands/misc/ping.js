const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('BOTの応答速度を測定します'),
    async execute(interaction) {
        const msg = await interaction.reply({ content: 'レイテンシーを計測中です...', fetchReply: true });
        const embed = new EmbedBuilder()
            .setTitle('現在のBOTのPing値')
            .addFields(
                { name: '📡BOT応答時間', value: `${codeBlock(`${msg.createdTimestamp - interaction.createdTimestamp}ms`)}`, inline: true },
                { name: '📡API応答時間', value: `${codeBlock(`${interaction.client.ws.ping}ms`)}` }
            )

        await interaction.editReply({
            content: '計測終了しました。',
            embeds: [embed]
        });
    }
};