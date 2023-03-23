const { EmbedBuilder, Colors } = require("discord.js");
const osu = require('os-utils');
const os = require('os');
const cpuModel = os.cpus()[0].model;
const wait = new EmbedBuilder()
    .setTitle("✅処理中..")
    .setDescription(`計測しています`)
    .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | status" })
    .setColor(Colors.Green);
module.exports = async (interaction) => {
    await interaction.reply({ embeds: [wait], ephemeral: true });
    osu.cpuUsage(async usage => {
        const memUsage = osu.freememPercentage();
        const msg = await interaction.editReply({ embeds: [wait], ephemeral: true });
        const embed = new EmbedBuilder()
            .setTitle('✅サーバー情報')
            .setColor(Colors.Green)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, format: 'webp', size: 4096 }) || "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png")
            .addFields(
                { name: 'プラットフォーム', value: `\`${osu.platform()}\``, inline: true },
                { name: 'CPU型番', value: `\`${cpuModel}\`` },
                { name: 'CPU使用率', value: `\`${Math.round(usage * 100)}\`%`, inline: true },
                { name: 'メモリー使用率', value: `\`${Math.round(100 - (memUsage * 100))}\`%`, inline: true },
                { name: '参加ボイスチャンネル数', value: `\`${Object.keys(globalThis.voice_channel).length}\`チャンネル`, inline: true },
                { name: '視聴Twitch数', value: `\`${Object.keys(globalThis.tlivechat).length}\`チャンネル`, inline: true },
                { name: '視聴Youtube数', value: `\`${Object.keys(globalThis.ylivechat).length}\`チャンネル`, inline: true },
                { name: 'BOT応答時間', value: `\`${msg.createdTimestamp - interaction.createdTimestamp}\`ms`, inline: true },
                { name: 'API応答時間', value: `\`${interaction.client.ws.ping}\`ms`, inline: true },
                { name: 'バージョン', value: `\`${process.env.version}\``, inline: true },
            )
            .setTimestamp(new Date())
            .setFooter({ iconURL: "https://media.discordapp.net/attachments/1081437402389811301/1082168221320364062/kuroneko.png", text: "©️ 2023 KURONEKOSERVER | status" });
        await interaction.editReply({ embeds: [embed], ephemeral: true });
    });
};