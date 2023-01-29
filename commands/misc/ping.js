const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('BOTの応答速度を測定します'),
    async execute(interaction) {
        const msg = await interaction.reply({ content: 'レイテンシーを計測中です...', fetchReply: true });
        const embed = new EmbedBuilder()
            .setTitle('現在のBOTのPing値')
            .setDescription(`計測結果:\n📡BOT応答時間:${msg.createdTimestamp - interaction.createdTimestamp}ws\n📡API応答時間:${interaction.client.ws.ping}ws`);

        await interaction.editReply({
            content: '計測終了しました。',
            embeds: [embed]
        });
    }
};