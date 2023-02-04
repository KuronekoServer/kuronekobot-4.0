const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ja } = require('../../helpers/permissions');
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
module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .addUserOption(option => option
            .setName("user")
            .setDescription('調べたいユーザー'))
        .setDescription('ユーザー情報を表示します'),
    async execute(interaction) {
        const member = interaction.guild.members.cache.get(interaction.options.getUser("user")?.id) || interaction.member;
        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username}の情報`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.webp`)
            .addFields(
                { name: '名前(ID)', value: `${member.user.tag}(${member.user.id})` },
                { name: 'サーバー参加日', value: `<t:${String(member.joinedTimestamp).slice(0, 10)}>(<t:${String(member.joinedTimestamp).slice(0, 10)}:R>)` },
                { name: 'Discord参加日', value: `<t:${String(member.user.createdTimestamp).slice(0, 10)}>(<t:${String(member.user.createdTimestamp).slice(0, 10)}:R>)` },
                { name: `役職(${member.roles.cache.size})`, value: `${member.roles.cache.map(role => role).join(",")}` },
                { name: 'BOTか否か', value: `${member.user.bot ? "はい" : "いいえ"}` },
                { name: 'ステータス', value: `${member.presence?.clientStatus ? `${status.key[Object.keys(member.presence.clientStatus)[0]] || "不明"}でログイン中\n状態:${status.value[Object.values(member.presence.clientStatus)[0]] || "オフライン"}` : "オフライン"}` },
                { name: 'ニックネーム', value: `${member.nickname || "なし"}` },
                { name: '権限一覧', value: `${member.permissions.toArray().map(permission => `\`${ja[permission] || permission}\``).join(",")}` }
            );
        await interaction.reply({
            embeds: [embed]
        });
    }
};