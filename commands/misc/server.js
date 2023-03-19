const { SlashCommandBuilder, EmbedBuilder, codeBlock, ChannelType, Colors } = require('discord.js');
const moment = require('moment');
moment.locale('ja');

const filterLevel = {
    0: 'Disabled - いかなるメディアコンテンツをスキャンしないでください。(全員を信頼する)',
    1: 'Medium - ロールのないメンバーのメディアコンテンツをスキャンします。(ロールを持つメンバーを信頼する)',
    2: 'High - すべてのメンバーのメディアコンテンツをスキャンします。(クリーンなサーバーに推奨)'
};

const verificationLevel = {
    0: '設定しない - 無制限',
    1: '低 - メール認証がされてるアカウントのみ',
    2: '中 - Discordに登録してから5分以上経過したアカウントのみ',
    3: '高 - このサーバーにメンバーとなってから10分以上経過したアカウントのみ',
    4: '最高 - 電話認証がされているアカウントのみ'
};

const verified = {
    true: '認証されています',
    false: '認証されていません'
};

const partnered = {
    true: 'パートナープログラムに登録されています',
    false: 'パートナープログラムに登録されていません'
};

const membersRole = (members, role) => {
    return members.filter((m) => m.roles.cache.has(role.id)).size;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDMPermission(false)
        .setDescription('サーバー情報を取得します'),
    async execute(interaction) {
        const members = interaction.guild.members.cache;
        const roles = interaction.guild.roles.cache;
        const channels = interaction.guild.channels.cache;
        const emojis = interaction.guild.emojis.cache;
        const stickers = interaction.guild.stickers.cache;
        const owner = await interaction.guild.fetchOwner();

        const embed = new EmbedBuilder()
            .setTitle('✅サーバー情報')
            .setColor(Colors.Green)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, format: 'png', size: 4096 }))
            .addFields(
                { name: '基本情報', value: '\u200b' },
                { name: 'サーバー名・ID', value: `${codeBlock(`${interaction.guild.name} - ${interaction.guild.id}`)}` },
                { name: 'オーナー名・ID', value: `${codeBlock(`${owner.user.tag} - ${interaction.guild.ownerId}`)}` },
                { name: '言語', value: `${codeBlock(interaction.guild.preferredLocale)}`, inline: true },
                { name: 'ブーストレベル', value: `${codeBlock(`レベル-${interaction.guild.premiumTier}`)}`, inline: true },
                { name: `サーバー作成日[${moment(interaction.guild.createdAt).fromNow()}]`, value: `${codeBlock(moment(interaction.guild.createdAt).format("YYYY年MMMMDodddd"))}` },
                { name: `カテゴリーとチャンネル`, value: `${codeBlock(`カテゴリー:${channels.filter(channel => channel.type === ChannelType.GuildCategory).size}|テキスト:${channels.filter(channel => channel.type === ChannelType.GuildText).size}|ボイス:${channels.filter(channel => channel.type === ChannelType.GuildVoice).size}`)}` },
                { name: 'その他のチャンネル', value: `${codeBlock(`アナウンス:${channels.filter(channel => channel.type === ChannelType.GuildAnnouncement).size}|フォーラム:${channels.filter(channel => channel.type === ChannelType.GuildForum).size}|スレッド:${channels.filter(channel => channel.type === ChannelType.PublicThread).size}|ステージ:${channels.filter(channel => channel.type === ChannelType.GuildStageVoice).size}`)}` },
                { name: `ロール[${roles.size}]`, value: `${codeBlock(roles.filter(r => !r.name.includes('everyone')).sort((a, b) => b.position - a.position).map(r => `${r.name}[${membersRole(members, r)}]`).join(','))}` },
                { name: '\u200b', value: '\u200b' },
                { name: '高度な情報', value: '\u200b' },
                { name: 'メディアコンテンツフィルター', value: `${codeBlock(filterLevel[interaction.guild.explicitContentFilter])}` },
                { name: '認証レベル', value: `${codeBlock(verificationLevel[interaction.guild.verificationLevel])} ` },
                { name: '認証サーバー', value: `${codeBlock(verified[interaction.guild.verified])} ` },
                { name: 'パートナープログラム', value: `${codeBlock(partnered[interaction.guild.partnered])} ` },
                { name: '\u200b', value: '\u200b' },
                { name: 'メンバーと絵文字(ステッカー)', value: '\u200b' },
                { name: `メンバー[${interaction.guild.memberCount}]`, value: `${codeBlock(`ユーザー:${members.filter(member => !member.user.bot).size}\nボット:${members.filter(member => member.user.bot).size}`)}`, inline: true },
                { name: `絵文字[${emojis.size}]`, value: `${codeBlock(`通常:${emojis.filter(emoji => !emoji.animated).size}\nアニメーション:${emojis.filter(emoji => emoji.animated).size}\nステッカー:${stickers.size}`)}`, inline: true }
            )
            .setTimestamp(new Date())
            .setFooter({
                text: `${interaction.guild.name}`,
                iconURL: `${interaction.guild.icon === null ? "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" : interaction.guild.iconURL({ dynamic: true, format: 'png', size: 4096 })}`
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}