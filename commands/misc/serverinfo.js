const { EmbedBuilder, codeBlock, ChannelType, Colors } = require("discord.js");
const { ts2time } = require("../../libs");

const filterLevel = {
    0: "Disabled - いかなるメディアコンテンツをスキャンしないでください。(全員を信頼する)",
    1: "Medium - ロールのないメンバーのメディアコンテンツをスキャンします。(ロールを持つメンバーを信頼する)",
    2: "High - すべてのメンバーのメディアコンテンツをスキャンします。(クリーンなサーバーに推奨)"
};

const verificationLevel = {
    0: "設定しない - 無制限",
    1: "低 - メール認証がされてるアカウントのみ",
    2: "中 - Discordに登録してから5分以上経過したアカウントのみ",
    3: "高 - このサーバーにメンバーとなってから10分以上経過したアカウントのみ",
    4: "最高 - 電話認証がされているアカウントのみ"
};

const verified = {
    true: "認証されています",
    false: "認証されていません"
};

const partnered = {
    true: "パートナープログラムに登録されています",
    false: "パートナープログラムに登録されていません"
};

const membersRole = (members, role) => {
    return members.filter((m) => m.roles.cache.has(role.id)).size;
};

module.exports = {
    builder: (builder) => builder
        .setName("serverinfo")
        .setDescription("サーバー情報を表示します。")
        .addBooleanOption((option) => option
            .setName("ephemeral")
            .setDescription("あなただけが見れるようにするか")
        )
        .setDMPermission(false)
    ,
    async execute(command) {
        const members = command.guild.members.cache;
        const roles = command.guild.roles.cache;
        const channels = command.guild.channels.cache;
        const emojis = command.guild.emojis.cache;
        const stickers = command.guild.stickers.cache;
        const owner = await command.guild.fetchOwner();

        const fields = [
            { name: "基本情報", value: "\u200b" },
            { name: "サーバー名・ID", value: `${codeBlock(`${command.guild.name} - ${command.guild.id}`)}` },
            { name: "オーナー名・ID", value: `${codeBlock(`${owner.user.tag} - ${command.guild.ownerId}`)}` },
            { name: "言語", value: `${codeBlock(command.guild.preferredLocale)}`, inline: true },
            { name: "ブーストレベル", value: `${codeBlock(`レベル-${command.guild.premiumTier}`)}`, inline: true },
            { name: `サーバー作成日`, value: `${ts2time(command.guild.createdAt)} (${ts2time(command.guild.createdAt, "R")})` },
            { name: `カテゴリーとチャンネル`, value: `${codeBlock(`カテゴリー:${channels.filter(channel => channel.type === ChannelType.GuildCategory).size}|テキスト:${channels.filter(channel => channel.type === ChannelType.GuildText).size}|ボイス:${channels.filter(channel => channel.type === ChannelType.GuildVoice).size}`)}` },
            { name: "その他のチャンネル", value: `${codeBlock(`アナウンス:${channels.filter(channel => channel.type === ChannelType.GuildAnnouncement).size}|フォーラム:${channels.filter(channel => channel.type === ChannelType.GuildForum).size}|スレッド:${channels.filter(channel => channel.type === ChannelType.PublicThread).size}|ステージ:${channels.filter(channel => channel.type === ChannelType.GuildStageVoice).size}`)}` },
            { name: `ロール[${roles.size}]`, value: `${codeBlock(roles.filter(r => !r.name.includes("everyone")).sort((a, b) => b.position - a.position).map(r => `${r.name}[${membersRole(members, r)}]`).join(","))}` },
            { name: "\u200b", value: "\u200b" },
            { name: "高度な情報", value: "\u200b" },
            { name: "メディアコンテンツフィルター", value: `${codeBlock(filterLevel[command.guild.explicitContentFilter])}` },
            { name: "認証レベル", value: `${codeBlock(verificationLevel[command.guild.verificationLevel])} ` },
            { name: "認証サーバー", value: `${codeBlock(verified[command.guild.verified])} ` },
            { name: "パートナープログラム", value: `${codeBlock(partnered[command.guild.partnered])} ` },
            { name: "\u200b", value: "\u200b" },
            { name: "メンバーと絵文字(ステッカー)", value: "\u200b" },
            { name: `メンバー[${command.guild.memberCount}]`, value: `${codeBlock(`ユーザー:${members.filter(member => !member.user.bot).size}\nボット:${members.filter(member => member.user.bot).size}`)}`, inline: true },
            { name: `絵文字[${emojis.size}]`, value: `${codeBlock(`通常:${emojis.filter(emoji => !emoji.animated).size}\nアニメーション:${emojis.filter(emoji => emoji.animated).size}\nステッカー:${stickers.size}`)}`, inline: true }
        ];

        function limitString(str, maxLength) {
            if (str.length >= maxLength) {
                return str.substring(0, maxLength - 3) + "...";
            } else {
                return str;
            }
        };

        const editedFields = fields.map((field) => {
            return { name: field.name, value: limitString(field.value, 1024) };
        });

        const embed = new EmbedBuilder()
            .setTitle("✅サーバー情報")
            .setColor(Colors.Green)
            .setThumbnail(command.guild.iconURL({ dynamic: true, format: "png", size: 4096 }))
            .addFields(editedFields)
            .setTimestamp(new Date())
            .setFooter({
                text: `${command.guild.name}`,
                iconURL: `${command.guild.icon === null ? "https://cdn.mikandev.tech/public-assets/clyde-blue.png" : command.guild.iconURL({ dynamic: true, format: "png", size: 4096 })}`
            });

        if (command.options.getBoolean("ephemeral")) {
            return command.reply({ embeds: [embed], ephemeral: true });
        } else {
            return command.reply({ embeds: [embed] });
        };
    }
}