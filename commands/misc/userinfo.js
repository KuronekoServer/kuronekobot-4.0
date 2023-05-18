const { Colors, time, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageComponentInteraction } = require("discord.js");
const { CustomEmbed } = require("../../libs");
const { ja } = require("../../libs/Permissions");
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
    builder: (builder) => builder
        .setName("userinfo")
        .setDescription("ユーザー情報を取得します。")
        .addUserOption((option) => option
            .setName("user")
            .setDescription("対象のユーザー")
        )
        .addBooleanOption((option) => option
            .setName("ephemeral")
            .setDescription("自分だけが見れるようにするか")
        ),
    async execute(interaction) {
        const { client, channel, options } = interaction;
        const user = options.getUser("user") || interaction.user;
        const ephemeral = interaction.options.getBoolean("ephemeral") || false;

        const mutualGuilds = client.guilds.cache.filter(guild => guild.members.cache.has(user.id));

        const embed = new CustomEmbed("userinfo")
            .setTitle(`${user.username} の情報`)
            .setThumbnail((user.avatar) ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp` : "https://discord.com/assets/7c8f476123d28d103efe381543274c25.png")
            .setColor(Colors.Green);

        let member;
        if (channel.isDMBased || !options.getUser("user")) {
            if (mutualGuilds.size) {
                if (mutualGuilds.has(channel.guild?.id)) {
                    member = channel.guild.members.cache.get(user.id);
                } else {
                    member = mutualGuilds.first().members.cache.get(user.id);
                }
            } else {
                member = null;
            }
        } else {
            member = interaction.member;
        }

        const inThisGuild = channel.guild && member?.guild?.id === channel.guild.id;

        embed.addFields({ name: "ユーザー (id)", value: `${user} (${user.id})`, inline: !inThisGuild });
        if (inThisGuild) embed.addFields({ name: "ニックネーム", value: `${member.nickname || user.username}`, inline: true });
        embed.addFields({ name: "Botかどうか", value: `${user.bot ? "はい" : "いいえ"}`, inline: true });
        let presenceText;
        if (member) {
            if (Object.keys(member.presence?.clientStatus || {}).length) {
                presenceText = 
                    `${status.key[Object.keys(member.presence.clientStatus)[0]]}でログイン中\n` +
                    `状態:${status.value[Object.values(member.presence.clientStatus)[0]]}`;
            } else {
                presenceText = "オフライン"
            }
        } else {
            presenceText = "取得できませんでした"
        }
        embed.addFields(
            { name: "ステータス", value: presenceText },
            { name: "Discordアカウント作成日時", value: `${ts2time(user.createdTimestamp)} (${ts2time(user.createdTimestamp, "R")})` }
        );
        if (inThisGuild) embed.addFields({ name: "サーバー参加日時", value: `${ts2time(member.joinedTimestamp)} (${ts2time(member.joinedTimestamp, "R")})` });
        if (inThisGuild) {
            const roles = member.roles.cache
                .filter(role => role.name !== "@everyone")
                .map(role => role);
            embed.addFields({ name: `役職 (${roles.length})`, value: `${roles.join(", ")}`})
        }

        if (inThisGuild) {
            const component = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("userinfo_permissions")
                        .setLabel("権限一覧を表示する")
                        .setStyle(ButtonStyle.Primary)
                );
            const message = await interaction.reply({ embeds: [embed], components: [component], ephemeral, fetchReply: true });
            message.awaitMessageComponent({ filter: (i) => i.customId === "userinfo_permissions", time: 3 * 60 * 1000 })
                .then(() => {
                    const permissions = member.permissions;
                    embed.addFields({ name: "権限一覧", value: `${permissions.toArray().map(permission => `\`${ja[permission] || permission}\``).join(", ")}` });
                })
                .catch(() => { })
                .then(() => {
                    interaction.editReply({ embeds: [embed], components: [] });
                })
        } else {
            interaction.reply({ embeds: [embed], ephemeral })
        }
    }
}

//timeをdiscordのメッセージタイムスタンプに変換
function ts2time(timestamp, format) {
    return time(Math.floor(timestamp / 1000), format);
}