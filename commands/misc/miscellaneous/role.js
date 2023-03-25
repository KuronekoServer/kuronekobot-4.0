const { EmbedBuilder, Colors } = require('discord.js');
const { PagesManager } = require('discord.js-pages');
const pagesManager = new PagesManager();
module.exports = async (interaction) => {
    if (interaction.options.getRole("role")?.id) {
        const role = await interaction.guild.roles.fetch(interaction.options.getRole("role")?.id);
        const members = interaction.guild.members.cache.filter(member => member.roles.cache.has(role.id))
        const createdAt = role.createdAt;
        const success = new EmbedBuilder()
            .setTitle(`✅役職情報`)
            .addFields(
                { name: '名前(id)', value: `${role.name}(${role.id})` },
                { name: 'カラーコード', value: `${role.color || "なし"}` },
                { name: 'メンション可能', value: `${role.mentionable ? "はい" : "いいえ"}` },
                { name: '別表示', value: `${role.hoist ? "はい" : "いいえ"}` },
                { name: '作成日時', value: `${createdAt.getFullYear()}年${createdAt.getMonth() + 1}月${createdAt.getDate()}日` },
                { name: `メンバー(${members.size})`, value: `${members.map(member => member.user.username).join("") || "なし"}` },
            )
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | role" })
            .setColor(Colors.Green);
        await interaction.reply({ embeds: [success], ephemeral: true });
    } else {
        await interaction.deferReply({ ephemeral: true });
        const roles = interaction.member.roles.cache;
        pagesManager.middleware(interaction);
        const content = roles.map((role) => new EmbedBuilder().addFields(
            { name: '名前(id)', value: `${role.name}(${role.id})` },
            { name: 'カラーコード', value: `${role.color || "なし"}` },
            { name: 'メンション可能', value: `${role.mentionable ? "はい" : "いいえ"}` },
            { name: '別表示', value: `${role.hoist ? "はい" : "いいえ"}` },
            { name: '作成日時', value: `${role.createdAt.getFullYear()}年${role.createdAt.getMonth() + 1}月${role.createdAt.getDate()}日` },
            { name: `メンバー(${interaction.guild.members.cache.filter(member => member.roles.cache.has(role.id)).size})`, value: `${interaction.guild.members.cache.filter(member => member.roles.cache.has(role.id)).map(member => member.user.username).join("") || "なし"}` },
        ));
        await interaction.pagesBuilder()
            .setTitle('✅役職情報')
            .setPages(content)
            .setColor('Green')
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | role" })
            .setPaginationFormat()
            .build();
    };
};