const { EmbedBuilder, Colors } = require('discord.js');
const channeltype = { 0: "テキストチャンネル", 2: "ボイスチャンネル", 5: "アナウンスチャンネル" }
module.exports = async (interaction) => {
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const createdAt = channel.createdAt;
    const success = new EmbedBuilder()
        .setTitle(`✅チャンネル情報`)
        .addFields(
            { name: '名前(id)', value: `${channel.name}(${channel.id})` },
            { name: '種類', value: `${channeltype[channel.type] || "取得失敗"}` },
            { name: '親カテゴリー', value: `${interaction.guild.channels.cache.get(channel.parentId) || "なし"}` },
            { name: '作成日時', value: `${createdAt.getFullYear()}年${createdAt.getMonth() + 1}月${createdAt.getDate()}日` },
            { name: `年齢制限`, value: `${channel.nsfw ? "はい" : "いいえ"}` },
            { name: `スローモード (秒)`, value: `${(channel.rateLimitPerUser == 0) ? `${channel.rateLimitPerUser}秒` : "なし"}` },
            { name: `説明文`, value: `${channel.topic || "なし"}` },
        )
        .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | role" })
        .setColor(Colors.Green);
    await interaction.reply({ embeds: [success], ephemeral: true });
};