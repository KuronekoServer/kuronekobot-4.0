const { SlashCommandBuilder, EmbedBuilder, time } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('debug')
        .setDescription('BOTの情報を表示します'),
    async execute(interaction) {
        const latency = new EmbedBuilder()
            .setTitle(`BOTの情報`)
            .setDescription("レイテンシー計測しています...")
        const msg = await interaction.reply({ embeds: [latency], fetchReply: true, ephemeral: true });
        const embed = new EmbedBuilder()
            .setTitle(`BOTの情報`)
            .addFields(
                { name: 'Ping', value: `📡BOT応答時間:${msg.createdTimestamp - interaction.createdTimestamp}ws\n📡API応答時間:${interaction.client.ws.ping}ws` },
                { name: 'サポートサーバー', value: `https://discord.gg/Y6w5Jv3EAR` }
            );
        await interaction.editReply({
            embeds: [embed], ephemeral: true
        });
    }
};