const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const { ja } = require('../../../helpers/permissions');
const status = {
    key: {
        desktop: "デスクトップ",
        web: "Web",
        mobile: "スマホ"
    },
    value: {
        online: "オンライン",
        idle: "退席中",
        dnd: "取り込み中"
    }
}
module.exports = async (interaction) => {
    const member = interaction.guild.members.cache.get(interaction.options.getUser("user")?.id) || interaction.member;
    const embed = new EmbedBuilder()
        .setTitle(`✅${member.user.username}の情報`)
        .setThumbnail((member.user.avatar) ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.webp` : "https://discord.com/assets/7c8f476123d28d103efe381543274c25.png")
        .setColor(Colors.Green)
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | userinfo" })
        .addFields(
            { name: '名前(ID)', value: `${member.user.tag}(${member.user.id})` },
            { name: 'サーバー参加日', value: `<t:${String(member.joinedTimestamp).slice(0, 10)}>(<t:${String(member.joinedTimestamp).slice(0, 10)}:R>)` },
            { name: 'Discord参加日', value: `<t:${String(member.user.createdTimestamp).slice(0, 10)}>(<t:${String(member.user.createdTimestamp).slice(0, 10)}:R>)` },
            { name: `役職(${member.roles.cache.filter(role => role.name !== "@everyone").size})`, value: `${member.roles.cache.filter(role => role.name !== "@everyone").map(role => role).join(",")}` },
            { name: 'BOTか否か', value: `${member.user.bot ? "はい" : "いいえ"}` },
            { name: 'ステータス', value: `${status.value[Object.values(member.presence?.clientStatus || {})[0]] ? `${status.key[Object.keys(member.presence.clientStatus)[0]]}でログイン中\n状態:${status.value[Object.values(member.presence.clientStatus)[0]]}` : "オフライン"}` },
            { name: 'ニックネーム', value: `${member.nickname || "なし"}` },
            { name: '権限一覧', value: `${member.permissions.toArray().map(permission => `\`${ja[permission] || permission}\``).join(",")}` }
        );
    await interaction.reply({
        embeds: [embed]
    });
};