const { SlashCommandBuilder, EmbedBuilder, time } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('サーバー情報を表示します'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name}の情報`)
            .addFields(
                { name: 'サーバー作成日', value: `${time(interaction.guild.createdAt, 'R')}` },
                { name: 'チャンネル数', value: `${interaction.guild.channels.cache.size}` },
                { name: 'メンバー数', value: `${interaction.guild.members.cache.size}` },
                { name: 'ロール数', value: `${interaction.guild.roles.cache.size}` },
                { name: 'ロール一覧', value: `${interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString())}` }
            );
        await interaction.reply({
            embeds: [embed]
        });
    }
};